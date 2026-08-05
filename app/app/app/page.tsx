import Link from "next/link";

export default function AccueilPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink text-paper text-2xl font-bold mb-5">
            R°
          </div>
          <h1 className="text-3xl font-bold mb-3 leading-tight">
            RetrouveObjetsPerdu
          </h1>
          <p className="text-ink/70 text-base leading-relaxed">
            Enregistrez vos objets personnels pour augmenter vos chances de
            les retrouver s&apos;ils sont un jour perdus.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/trouve"
            className="block w-full min-h-[56px] rounded-xl bg-alert text-white font-semibold text-base flex items-center justify-center px-6 active:bg-alert/90 transition-colors"
          >
            J&apos;ai trouvé un objet
          </Link>

          <Link
            href="/connexion"
            className="block w-full min-h-[56px] rounded-xl bg-white border-2 border-ink/10 text-ink font-semibold text-base flex items-center justify-center px-6 active:bg-ink/5 transition-colors"
          >
            Se connecter
          </Link>

          <Link
            href="/inscription"
            className="block w-full min-h-[56px] rounded-xl bg-ink text-paper font-semibold text-base flex items-center justify-center px-6 active:bg-ink/90 transition-colors"
          >
            Créer un compte
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-ink/40 pb-6 px-6">
        Vos objets, vos données : uniquement visibles par vous, sauf en cas
        de perte déclarée.
      </p>
    </main>
  );
}
