import { createBrowserClient } from "@supabase/ssr";

// Ce client est utilisé dans les composants qui tournent dans le navigateur
// (formulaires, boutons, tout ce qui réagit à un clic de l'utilisateur).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
