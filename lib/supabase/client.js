import { createBrowserClient } from "@supabase/ssr";

let supabase;

export function getSupabaseBrowserClient() {
  if (!supabase) {
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    );
  }

  return supabase;
}
