import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { normalizeIdentifier } from "@/lib/utils";
import ContactRelayForm from "./ContactRelayForm";

export default async function ObjetPubliquePage({
  params,
}: {
  params: { identifiant: string };
}) {
  const supabase = createClient();
  const identifier = normalizeIdentifier(params.identifiant);

  const { data: object } = await supabase
    .from("objects_public_view")
    .select("*")
    .eq("identifier", identifier)
    .maybeSingle();

  let photoUrl: string | null = null;
  if (object?.photo_path) {
    const { data: signed } = await supabase.storage
      .from("object-photos")
      .createSignedUrl(object.photo_path, 3600);
    photoUrl = signed?.signedUrl ?? null;
  }

  return (
    <main className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto w-full">
      <Link href="/trouve" className="text-sm text-ink/50 font-medium mb-6">
        ← Nouvelle recherche
      </Link>

      {!object ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-ink/15 p-8 text-center mt-4">
          <p className="text-3xl mb-3">🔍</p>
          <h1 className="font-bold text-lg mb-2">Identifiant introuvable</h1>
          <p className="text-sm text-ink/60">
            Aucun objet déclaré perdu ne correspond à «&nbsp;{identifier}
            &nbsp;». Vérifiez la saisie, ou l&apos;objet n&apos;a peut-être
            pas encore été déclaré perdu par son propriétaire.
          </p>
        </div>
      ) : (
        <div>
          <div className="bg-alert/10 text-alert text-sm font-bold px-3 py-2 rounded-lg inline-block mb-4">
            🔴 Objet déclaré perdu
          </div>

          {photoUrl ? (
            <img
              src={photoUrl}
              alt={object.name}
              className="w-full h-56 object-cover rounded-xl mb-4 border-2 border-ink/10"
            />
          ) : (
            <div className="w-full h-40 rounded-xl bg-ink/5 flex items-center justify-center text-4xl mb-4">
              📦
            </div>
          )}

          <h1 className="text-2xl font-bold mb-2">{object.name}</h1>
          <p className="text-ink/70 mb-6">{object.description}</p>

          {object.contact_message && (
            <div className="bg-safe/10 border-2 border-safe/20 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-safe mb-1">
                MESSAGE DU PROPRIÉTAIRE
              </p>
              <p className="text-sm text-ink/80">{object.contact_message}</p>
            </div>
          )}

          <ContactRelayForm />
        </div>
      )}
    </main>
