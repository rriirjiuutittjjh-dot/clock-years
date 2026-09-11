import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardMark } from "@/components/auth/auth-art";
import { GatePage } from "@/components/chrome/gate-page";
import { CountdownClock } from "@/components/space/countdown-clock";
import { nextNewYear, splitMs, yearProgress } from "@/lib/countdown";
import { getMyProfile } from "@/lib/server/profiles";
import type { Profile } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    void getMyProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
    const tick = () => {
      const now = new Date();
      setParts(splitMs(nextNewYear(now).getTime() - now.getTime()));
      setPct(yearProgress(now));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const role = profile?.role ?? null;

  return (
    <GatePage current="/dashboard" role={role}>
      <section className="glass rounded-[32px] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <DashboardMark />
          <div>
            <p className="text-xs tracking-[0.28em] text-muted uppercase">Member orbit</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {profile ? `Welcome, ${profile.displayName}` : "Dashboard"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {profile?.bio || "Set a bio in Account to leave a trace in the system."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs tracking-[0.16em] uppercase">
            {role ?? "member"}
          </span>
          {profile?.email ? (
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-muted">{profile.email}</span>
          ) : null}
        </div>
      </section>

      <section className="glass mt-4 rounded-[32px] p-6 sm:p-8">
        <h2 className="text-sm tracking-[0.2em] text-muted uppercase">Countdown</h2>
        <div className="mt-4">
          <CountdownClock parts={parts} />
        </div>
        <div className="mx-auto mt-6 h-1.5 max-w-md overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-ice" style={{ width: `${pct.toFixed(2)}%` }} />
        </div>
        <p className="mt-3 text-center text-xs text-muted">{pct.toFixed(2)}% of this year has passed</p>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link to="/settings" className="glass block rounded-[28px] p-6 no-underline transition-colors hover:bg-white/6">
          <h2 className="text-lg font-medium">Account</h2>
          <p className="mt-1 text-sm text-muted">Avatar, bio, and password.</p>
        </Link>
        {role === "admin" || role === "owner" ? (
          <Link to="/admin" className="glass block rounded-[28px] p-6 no-underline transition-colors hover:bg-white/6">
            <h2 className="text-lg font-medium">Admin</h2>
            <p className="mt-1 text-sm text-muted">Background, blur, and glass.</p>
          </Link>
        ) : (
          <div className="glass rounded-[28px] p-6">
            <h2 className="text-lg font-medium">Role</h2>
            <p className="mt-1 text-sm text-muted">
              Members explore System Space. Admins shape the sky. Owners hold the keys.
            </p>
          </div>
        )}
      </div>
    </GatePage>
  );
}
