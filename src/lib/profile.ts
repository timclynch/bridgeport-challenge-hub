import { useCallback, useEffect, useState } from "react";

export type Profile = { name: string; school: "ub" | null };

const KEY = "next-step:profile";

export const emptyProfile = (): Profile => ({ name: "", school: null });

export function readProfile(): Profile {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return {
      name: typeof parsed.name === "string" ? parsed.name.slice(0, 40) : "",
      school: parsed.school === "ub" ? "ub" : null,
    };
  } catch {
    return emptyProfile();
  }
}

export function writeProfile(p: Profile) {
  sessionStorage.setItem(KEY, JSON.stringify(p));
}

const subs = new Set<() => void>();

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  useEffect(() => {
    const sync = () => setProfile(readProfile());
    sync();
    subs.add(sync);
    return () => {
      subs.delete(sync);
    };
  }, []);
  const update = useCallback((patch: Partial<Profile>) => {
    const next = { ...readProfile(), ...patch };
    writeProfile(next);
    subs.forEach((s) => s());
  }, []);
  return { profile, update, ready: profile.name !== "" || profile.school !== null || typeof window !== "undefined" };
}

export function greetingFor(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
