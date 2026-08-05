import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import type { ObjectRow } from "@/lib/types";

export default async function TableauDeBordPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: objects } = await supabase
    .from("objects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const { count: totalCount } = await supabase
    .from("objects")
    .select("*", { count: "exact", head: true });

  const { count: perduCount } = await supabase
    .from("objects")
    .select("*", { count: "exact", head: true })
    .eq("status", "perdu");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Bonjour</h1>
      <p className="text-ink/60 text-sm mb-6">{user?.email}</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white rounded-xl border-2 border-ink/10 p-4">
          <p className="text-3xl font-bold">{totalCount ?? 0}</p>
          <p className="text-sm text-ink/60">Objet{(totalCount ?? 0) > 1 ? "s" : ""} enregistré{(totalCount ?? 0) > 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-alert/20 p-4">
          <p className="text-3xl font-bold text-alert">{perduCount ?? 0}</p>
          <p className="text-sm text-ink/60">Déclaré{(perduCount ?? 0) > 1 ? "s" : ""} perdu{(perduCount ?? 0) > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg">Objets récents</h2>
        <Link href="/espace/mes-objets" className="text-sm font-semibold text-safe">
          Tout voir
        </Link>
      </div>

      {!objects || objects.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-ink/15 p-8 text-center">
          <p className="text-ink/60 text-sm mb-4">
            Vous n&apos;avez encore ajouté aucun objet.
          </p>
          <Link
            href="/espace/ajouter"
            className="inline-block text-safe font-semibold text-sm"
          >
            + Ajouter mon premier objet
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {(objects as ObjectRow[]).map((obj) => (
            <Link
              key={obj.id}
              href={`/espace/mes-objets/${obj.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border-2 border-ink/10 p-3 active:bg-ink/5"
            >
              <div className="w-14 h-14 rounded-lg bg-ink/5 flex items-center justify-center text-xl shrink-0">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{obj.name}</p>
                <p className="text-xs text-ink/50 font-mono">{obj.identifier}</p>
              </div>
              <StatusBadge status={obj.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
