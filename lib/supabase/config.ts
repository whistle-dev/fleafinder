export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
