import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import type { ObjectRow } from "@/lib/types";

export default async function MesObjetsPage() {
  const supabase = createClient();

  const { data: objects, error } = await supabase
    .from("objects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes objets</h1>

      {error && (
        <p className="text-alert text-sm mb-4">
          Impossible de charger vos objets. Réessayez plus tard.
        </p>
      )}

      {!error && (!objects || objects.length === 0) && (
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
      )}

      <div className="space-y-3">
        {(objects as ObjectRow[] | null)?.map((obj) => (
          <Link
            key={obj.id}
            href={`/espace/mes-objets/${obj.id}`}
            className="block bg-white rounded-xl border-2 border-ink/10 p-4 active:bg-ink/5"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-semibold">{obj.name}</p>
              <StatusBadge status={obj.status} />
            </div>
            <p className="text-sm text-ink/60 line-clamp-2 mb-2">
              {obj.description}
            </p>
            <p className="text-xs text-ink/40 font-mono">{obj.identifier}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
