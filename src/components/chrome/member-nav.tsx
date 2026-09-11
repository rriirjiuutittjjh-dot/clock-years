import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { isStaff, type Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/settings", label: "Account" },
] as const;

export function MemberNav({ role, current }: { role: Role | null; current: string }) {
  return (
    <nav className="glass flex flex-wrap items-center gap-1 rounded-[22px] p-2">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className={cn(
            "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            current === l.to ? "bg-white/12 text-ink" : "text-muted hover:text-ink",
          )}
        >
          {l.label}
        </Link>
      ))}
      {isStaff(role) ? (
        <Link
          to="/admin"
          className={cn(
            "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            current === "/admin" ? "bg-white/12 text-ink" : "text-muted hover:text-ink",
          )}
        >
          Admin
        </Link>
      ) : null}
      <div className="ml-auto pl-2 text-sm [&_button]:text-muted [&_button]:no-underline hover:[&_button]:text-ink">
        <UserButton />
      </div>
    </nav>
  );
}
