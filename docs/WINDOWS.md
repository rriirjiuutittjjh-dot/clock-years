# Run on Windows 24/7

No `.exe` build step — Windows runs the same Node server the VPS does,
through a double-click launcher plus a Scheduled Task for 24/7.

Requirements: Windows 10/11 64-bit + **Node.js 22 LTS**
(https://nodejs.org — the installer, all defaults).

## Quick start (this session)

1. Unzip `clock.zip` anywhere (e.g. Desktop).
2. Double-click **`windows\start-windows.bat`**.
3. First run installs + builds (a few minutes), then opens
   http://localhost:8080 in your browser. Keep the black window open —
   closing it stops the app.

## Always-on (24/7)

One time, as Administrator:

1. Right-click `windows\install-service.ps1` → **Run with PowerShell**
   (or in an Admin PowerShell from the unzipped folder: `.\windows\install-service.ps1` —
   if scripts are blocked: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`).
2. Done: the server starts at every logon and restarts within a minute
   if it crashes. Undo anytime:
   `Unregister-ScheduledTask -TaskName ClockYears -Confirm:$false`

Need it running with nobody logged in (a server box)? Use
[NSSM](https://nssm.cc) to wrap `node .output\server\index.mjs` as a real
Windows Service instead of the task above.

## Free public URL via Cloudflare

Your PC has no static IP and no open ports — Cloudflare Tunnel fixes both,
free, no router changes. Start the app first (`windows\start-windows.bat`), then:

**Instant (random URL, changes every restart):** double-click
**`windows\tunnel-cloudflare.bat`** — it downloads `cloudflared.exe` once, then
prints a `https://....trycloudflare.com` URL. Share it; anyone can open
your countdown while both windows stay open.

**Stable (your own domain, still free beyond the domain):**

1. Buy any cheap domain (a `.xyz` is often ~$2 for the first year —
   truly-free domains no longer exist since Freenom shut down) and add
   it to Cloudflare's free plan (change nameservers at your registrar).
2. In a terminal in the `windows` folder:
   `cloudflared.exe tunnel login` (browser approves),
   `cloudflared.exe tunnel create clock`,
   `cloudflared.exe tunnel route dns clock clockyourdomain.com`.
3. Save this as `%USERPROFILE%\.cloudflared\config.yml` (use the tunnel
   ID printed by `create`):
   ```yaml
   tunnel: <tunnel-id>
   credentials-file: C:\Users\<you>\.cloudflared\<tunnel-id>.json
   ingress:
     - hostname: clockyourdomain.com
       service: http://localhost:8080
     - service: http_status:404
   ```
4. Set `BETTER_AUTH_URL=https://clockyourdomain.com` in `.env` and restart
   the app, then run `cloudflared.exe tunnel run clock` — for 24/7,
   `cloudflared.exe service install` (as Administrator) so the tunnel
   itself survives reboots too.
5. Re-check after any change: `BASE_URL=https://clockyourdomain.com bash scripts/test.sh`.

## Notes

- **Data:** out of the box the database is in-memory — users and settings
  reset when the server restarts. For persistence set `DATABASE_URL` in
  `.env` (a local Postgres, or a free Neon project) and restart.
- **Your account:** register in the app — first account becomes owner.
  To pin yourself as owner regardless of order, set `ADMIN_EMAILS` in
  `.env` before registering.
- **Network:** the server listens on port 8080 for this PC. To keep it
  strictly local, add `HOST=127.0.0.1` to `.env`. Windows Firewall may
  ask once — allow it only if you want other devices on your Wi-Fi to
  open the countdown.
- **Updates:** stop the server/task, re-unzip the new `clock.zip` over
  the folder (keep your `.env`), delete the `.output` folder so the
  launcher rebuilds, and start again.
- **Verify:** `BASE_URL=http://localhost:8080 bash scripts/test.sh` (in Git Bash)
  — same smoke suite the VPS uses.
