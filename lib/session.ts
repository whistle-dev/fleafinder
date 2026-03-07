import type { Profile } from "@/lib/types";

import { sampleProfiles } from "@/lib/sample-data";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, role, display_name, preferred_locale")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    return {
      id: user.id,
      email: user.email ?? "",
      displayName: user.user_metadata.display_name ?? user.email?.split("@")[0] ?? "Organizer",
      role: sampleProfiles.some((profile) => profile.email === user.email && profile.role === "admin") ? "admin" : "organizer",
      preferredLocale: "da"
    };
  }

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: data.display_name ?? user.email?.split("@")[0] ?? "Organizer",
    role: data.role,
    preferredLocale: data.preferred_locale ?? "da"
  };
}
