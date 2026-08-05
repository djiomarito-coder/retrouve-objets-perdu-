import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function EspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sécurité en profondeur : même si le middleware protège déjà /espace,
  // on revérifie ici au cas où. Jamais confiance à une seule couche.
  if (!user) {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10 bg-white">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/espace" className="font-bold text-lg">
            RetrouveObjetsPerdu
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-6 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-ink/10">
        <div className="max-w-md mx-auto grid grid-cols-3">
          <Link
            href="/espace"
            className="flex flex-col items-center justify-center py-3 min-h-[64px] text-sm font-medium text-ink/70 active:bg-ink/5"
          >
            <span className="text-lg mb-0.5">⌂</span>
            Tableau de bord
          </Link>
          <Link
            href="/espace/mes-objets"
            className="flex flex-col items-center justify-center py-3 min-h-[64px] text-sm font-medium text-ink/70 active:bg-ink/5"
          >
            <span className="text-lg mb-0.5">▤</span>
            Mes objets
          </Link>
          <Link
            href="/espace/ajouter"
            className="flex flex-col items-center justify-center py-3 min-h-[64px] text-sm font-medium text-ink/70 active:bg-ink/5"
          >
            <span className="text-lg mb-0.5">+</span>
            Ajouter
          </Link>
        </div>
      </nav>
    </div>
  );
}
