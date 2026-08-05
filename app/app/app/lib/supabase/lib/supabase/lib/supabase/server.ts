import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Ce client est utilisé côté serveur (pages qui chargent des données
// avant même que la page ne s'affiche à l'utilisateur).
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se produit si appelé depuis un Server Component sans
            // possibilité d'écrire un cookie : sans danger, le middleware
            // s'en charge déjà (voir middleware.ts).
          }
        },
      },
    }
  );
}
