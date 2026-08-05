"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { normalizeIdentifier } from "@/lib/utils";
import Button from "@/components/Button";
import { Alert } from "@/components/Alert";

const QrReader = dynamic(() => import("@/components/QrReader"), {
  ssr: false,
  loading: () => (
    <p className="text-center text-sm text-ink/50 py-6">Chargement du scanner...</p>
  ),
});

export default function TrouvePage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState("");
  const [error, setError] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = normalizeIdentifier(identifier);
    if (!cleaned) {
      setError("Merci d'entrer un identifiant.");
      return;
    }
    router.push(`/objet/${cleaned}`);
  }

  function handleScanResult(text: string) {
    try {
      const url = new URL(text);
      const parts = url.pathname.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
      router.push(`/objet/${normalizeIdentifier(id)}`);
    } catch {
      router.push(`/objet/${normalizeIdentifier(text)}`);
    }
  }

  return (
    <main className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto w-full">
      <Link href="/" className="text-sm text-ink/50 font-medium mb-6">
        ← Retour à l&apos;accueil
      </Link>

      <h1 className="text-2xl font-bold mb-2">Vous avez trouvé un objet ?</h1>
      <p className="text-ink/60 text-sm mb-8">
        Entrez l&apos;identifiant inscrit sur l&apos;objet, ou scannez son QR
        code. Aucun compte n&apos;est nécessaire.
      </p>

      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Ex. ROP-7K29F"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full min-h-[56px] px-4 rounded-xl border-2 border-ink/10 text-lg font-mono tracking-wide bg-white focus:outline-none focus:border-safe mb-3"
          autoCapitalize="characters"
        />
        <Button type="submit">Rechercher</Button>
      </form>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-ink/10" />
        <span className="text-xs text-ink/40 font-semibold">OU</span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>

      {!showScanner ? (
        <Button variant="secondary" onClick={() => setShowScanner(true)} className="mt-2">
          📷 Scanner le QR code
        </Button>
      ) : (
        <div className="mt-3">
          {scanError && <Alert type="error">{scanError}</Alert>}
          <QrReader onResult={handleScanResult} onError={() => setScanError("Impossible d'accéder à la caméra. Vérifiez les autorisations, ou utilisez la saisie manuelle ci-dessus.")} />
          <button
            onClick={() => setShowScanner(false)}
            className="w-full text-center text-sm text-ink/50 font-medium mt-3 min-h-[44px]"
          >
            Annuler le scan
          </button>
        </div>
      )}
    </main>
  );
}
