import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { GatePage } from "@/components/chrome/gate-page";
import { useTheme } from "@/components/theme-provider";
import { compressImage, sampleAverageColor } from "@/lib/image";
import { getMyProfile, listMembers, setMemberRole } from "@/lib/server/profiles";
import { updateSiteSettings } from "@/lib/server/site";
import { DEFAULT_SETTINGS, isStaff, type Profile, type Role, type SiteSettings } from "@/lib/types";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { settings, applySettings } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [members, setMembers] = useState<Profile[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  useEffect(() => {
    void getMyProfile()
      .then(async (p) => {
        setProfile(p);
        if (isStaff(p.role)) {
          try {
            setMembers(await listMembers());
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => setProfile(null));
  }, []);

  function patch(next: Partial<SiteSettings>) {
    const merged = { ...draft, ...next };
    setDraft(merged);
    applySettings(merged);
  }

  async function onBackground(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const url = await compressImage(file, { maxEdge: 1920, maxBytes: 1_500_000, quality: 0.8 });
      let color = draft.glassColor;
      if (draft.glassAuto) color = await sampleAverageColor(url);
      patch({ backgroundUrl: url, glassColor: color });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not use that image.");
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const saved = await updateSiteSettings({ data: draft });
      applySettings(saved);
      setDraft(saved);
      setStatus("Appearance saved for everyone.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    const next = { ...DEFAULT_SETTINGS };
    setDraft(next);
    applySettings(next);
  }

  async function changeRole(userId: string, role: Role) {
    try {
      setMembers(await setMemberRole({ data: { userId, role } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change role.");
    }
  }

  if (profile && !isStaff(profile.role)) {
    return (
      <GatePage current="/admin" role={profile.role}>
        <section className="glass rounded-[32px] p-8">
          <h1 className="text-2xl font-semibold">Admin only</h1>
          <p className="mt-2 text-sm text-muted">Ask the owner to promote your orbit.</p>
        </section>
      </GatePage>
    );
  }

  return (
    <GatePage current="/admin" role={profile?.role ?? null}>
      <section className="glass rounded-[32px] p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Background, blur, and glass. Values start at 0px. Auto glass samples the upload.
        </p>

        <form className="mt-8 space-y-6" onSubmit={(e) => void onSave(e)}>
          <div>
            <p className="field-label">Background</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="btn btn-ghost cursor-pointer">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => void onBackground(e.target.files?.[0])}
                />
              </label>
              {draft.backgroundUrl ? (
                <button type="button" className="btn btn-ghost" onClick={() => patch({ backgroundUrl: null })}>
                  Clear
                </button>
              ) : null}
            </div>
            {draft.backgroundUrl ? (
              <div
                className="mt-4 h-28 overflow-hidden rounded-[22px] bg-cover bg-center"
                style={{ backgroundImage: `url(${draft.backgroundUrl})`, filter: `blur(${draft.backgroundBlur}px)` }}
              />
            ) : null}
          </div>

          <label className="field">
            <span>Background blur · {draft.backgroundBlur}px</span>
            <input
              type="range"
              min={0}
              max={40}
              value={draft.backgroundBlur}
              onChange={(e) => patch({ backgroundBlur: Number(e.target.value) })}
            />
          </label>

          <label className="field">
            <span>Glass blur · {draft.glassBlur}px</span>
            <input
              type="range"
              min={0}
              max={40}
              value={draft.glassBlur}
              onChange={(e) => patch({ glassBlur: Number(e.target.value) })}
            />
          </label>

          <label className="field">
            <span>Glass fill · {draft.glassOpacity}</span>
            <input
              type="range"
              min={0}
              max={40}
              value={draft.glassOpacity}
              onChange={(e) => patch({ glassOpacity: Number(e.target.value) })}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="field">
              <span>Glass color</span>
              <input
                type="color"
                value={draft.glassColor}
                onChange={(e) => patch({ glassColor: e.target.value, glassAuto: false })}
              />
            </label>
            <label className="flex h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.glassAuto}
                onChange={(e) => patch({ glassAuto: e.target.checked })}
              />
              Color glass auto
            </label>
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {status ? <p className="text-sm text-ice">{status}</p> : null}

          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save appearance"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => void reset()}>
              Reset to 0
            </button>
          </div>
        </form>
      </section>

      <section className="glass mt-4 rounded-[32px] p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Members</h2>
        <p className="mt-1 text-sm text-muted">
          Roles: member, admin, owner. Only the owner can change them.
        </p>
        <ul className="mt-6 space-y-3">
          {members.map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center gap-3 rounded-[18px] bg-white/5 p-3">
              <div className="size-10 overflow-hidden rounded-full bg-white/10">
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt="" className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-sm">
                    {m.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{m.displayName}</p>
                <p className="truncate text-xs text-muted">{m.email}</p>
              </div>
              {profile?.role === "owner" ? (
                <select
                  className="min-h-11 rounded-xl bg-black/30 px-3 text-sm"
                  value={m.role}
                  onChange={(e) => void changeRole(m.userId, e.target.value as Role)}
                >
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                  <option value="owner">owner</option>
                </select>
              ) : (
                <span className="text-xs tracking-[0.16em] uppercase text-muted">{m.role}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </GatePage>
  );
}
