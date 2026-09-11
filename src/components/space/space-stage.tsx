import type { ReactNode } from "react";
import { useTheme } from "@/components/theme-provider";
import { Starfield } from "@/components/space/starfield";

export function SpaceStage({ children }: { children: ReactNode }) {
  const { settings } = useTheme();
  return (
    <div className="space-root">
      <div className="space-bg" aria-hidden="true">
        <div
          className="space-bg-custom"
          hidden={!settings.backgroundUrl}
          style={
            settings.backgroundUrl
              ? { backgroundImage: `url(${settings.backgroundUrl})` }
              : undefined
          }
        />
        <Starfield />
        <svg className="orbit-rings" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke="rgba(232,226,255,0.11)" strokeWidth="0.18">
            <circle cx="50" cy="42" r="18" />
            <circle cx="50" cy="42" r="28" />
            <circle cx="50" cy="42" r="40" />
            <circle cx="50" cy="42" r="54" />
          </g>
        </svg>
        <div className="scene-wash" />
      </div>
      <div className="space-content">{children}</div>
    </div>
  );
}
