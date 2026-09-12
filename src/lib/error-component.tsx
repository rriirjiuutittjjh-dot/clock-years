import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { useLocale } from "./i18n";

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const { t } = useLocale();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-void px-6 text-center text-ink">
      <span className="text-sun" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">{t.errorFallback.title}</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {errorMessage(error, t.errorFallback.message)}
      </p>
    </main>
  );
}
