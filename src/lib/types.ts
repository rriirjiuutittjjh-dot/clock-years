export const ROLES = ["member", "admin", "owner"] as const;
export type Role = (typeof ROLES)[number];

export type Profile = {
  userId: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  role: Role;
  email: string | null;
};

export type SiteSettings = {
  backgroundUrl: string | null;
  backgroundBlur: number;
  glassBlur: number;
  glassOpacity: number;
  glassColor: string;
  glassAuto: boolean;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  backgroundUrl: null,
  backgroundBlur: 0,
  glassBlur: 0,
  glassOpacity: 10,
  glassColor: "#ffffff",
  glassAuto: true,
};

export function isStaff(role: Role | null | undefined): boolean {
  return role === "admin" || role === "owner";
}
