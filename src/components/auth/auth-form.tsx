import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { AuthArt } from "@/components/auth/auth-art";
import { SpaceStage } from "@/components/space/space-stage";
import { AppChrome } from "@/components/chrome/app-chrome";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const title = mode === "login" ? "Log in" : "Create account";
  const subtitle =
    mode === "login"
      ? "Return to System Space. Your orbit is saved."
      : "Join as a member. The first account becomes owner.";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!authEnabled) {
      setError("Sign-in is disabled.");
      return;
    }
    if (mode === "register" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0] || "Member",
        });
        if (err) throw new Error(err.message || "Could not register.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (err) throw new Error(err.message || "Could not log in.");
      }
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <SpaceStage>
      <AppChrome hideAuth />
      <main className="mx-auto grid min-h-dvh w-full max-w-5xl items-center px-4 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="glass overflow-hidden rounded-[32px]">
          <AuthArt title={title} />
        </div>

        <section className="glass mt-6 rounded-[32px] p-6 sm:p-8 lg:mt-0">
          <p className="text-xs font-medium tracking-[0.28em] text-muted uppercase">System Space</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>

          <form className="mt-8 space-y-4" onSubmit={(e) => void onSubmit(e)}>
            {mode === "register" ? (
              <label className="field">
                <span>Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={80}
                  placeholder="Your name"
                />
              </label>
            ) : null}
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@orbit.mail"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="At least 8 characters"
              />
            </label>
            {mode === "register" ? (
              <label className="field">
                <span>Confirm password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                />
              </label>
            ) : null}

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <button className="btn btn-primary w-full" type="submit" disabled={busy}>
              {busy ? "Please wait…" : title}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link to="/register" className="text-ink underline-offset-4 hover:underline">
                  Register
                </Link>
              </>
            ) : (
              <>
                Already a member?{" "}
                <Link to="/login" className="text-ink underline-offset-4 hover:underline">
                  Log in
                </Link>
              </>
            )}
          </p>
        </section>
      </main>
    </SpaceStage>
  );
}
