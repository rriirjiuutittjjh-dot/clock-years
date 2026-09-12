# Deploy to a VPS (Ubuntu 24.04)

Own-server path: Docker + Postgres on any Ubuntu VPS. `vercel.json` is not
used here — this deploy runs the Nitro `node-server` preset (see
`Dockerfile`, `docker-compose.yml`).

Ubuntu **24.04 LTS** recommended (22.04 LTS works too). Any 1 vCPU / 1 GB
box runs this fine.

## 0. Point your domain at the VPS

In your DNS provider, add an `A` record: `clockyourdomain.com → <VPS IP>`.
Wait a minute, then continue — HTTPS below needs the name resolving.

## 1. Install Docker

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) \
signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

## 2. Get the code

```bash
# Option A: git
git clone -b arena/01a092ac-clock-years \
  https://github.com/rriirjiuutittjjh-dot/clock-years.git
cd clock-years

# Option B: upload clock.zip, then:
# sudo apt install -y unzip && unzip clock.zip && cd clock-years
```

## 3. Configure

```bash
cp .env.example .env
openssl rand -hex 32   # → BETTER_AUTH_SECRET
openssl rand -hex 24   # → POSTGRES_PASSWORD
```

Edit `.env`:

| Variable           | Value                                  |
| ------------------ | -------------------------------------- |
| `BETTER_AUTH_URL`  | `https://clockyourdomain.com` (no trailing slash) |
| `BETTER_AUTH_SECRET` | the 64-hex-char secret               |
| `ADMIN_EMAILS`     | your email — you sign in as owner      |
| `POSTGRES_PASSWORD`  | the 48-hex-char password             |

(`DATABASE_URL` is wired by `docker-compose.yml` — no need to set it.)

## 4. Launch

```bash
sudo docker compose up -d --build
sudo docker compose logs -f app   # wait for "Listening on", Ctrl-C to exit
curl -s -o /dev/null -w 'app=%{http_code}\n' http://localhost:8080/
bash test.sh                      # 8 smoke checks (read-only, safe)
bash test.sh --write              # + real signup/session round-trip
```

Migrations run automatically on every start (safe to re-run).

## 5. HTTPS with nginx + certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo tee /etc/nginx/sites-available/clock-years > /dev/null <<'EOF'
server {
    listen 80;
    server_name clockyourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/clock-years /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d clockyourdomain.com
```

`certbot` gets the certificate and renews it automatically. The
`X-Forwarded-Proto`/`Host` headers are required — auth cookies and
redirects break without them. Verify the public URL too:

```bash
BASE_URL=https://clockyourdomain.com bash test.sh
```

Lock down the firewall (app stays reachable only through nginx):

```bash
sudo ufw allow OpenSSH && sudo ufw allow 80,443/tcp && sudo ufw --force enable
```

## 6. Updates

```bash
cd clock-years
git pull            # or re-upload + unzip clock.zip
sudo docker compose up -d --build
```

Users, roles, and settings live in the `pgdata` volume and survive
rebuilds. Back it up:

```bash
sudo docker compose exec db \
  pg_dump -U clock clockyears | gzip > clock-backup-$(date +%F).sql.gz
```

## Useful commands

```bash
sudo docker compose ps                 # status
sudo docker compose logs -f --tail=50  # logs
sudo docker compose restart app        # restart app only
sudo docker compose down               # stop everything (data kept)
```
