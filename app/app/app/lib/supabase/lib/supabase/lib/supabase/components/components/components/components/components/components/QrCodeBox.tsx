"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

// Génère et affiche le QR code d'un objet à partir de son identifiant.
// Le QR encode une URL complète pour que le scan natif du téléphone
// ouvre directement la fiche de l'objet, sans étape de recopie.
export default function QrCodeBox({ identifier }: { identifier: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const url = `${window.location.origin}/objet/${identifier}`;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 1,
      color: { dark: "#1C1E26", light: "#FFFFFF" },
    });
  }, [identifier]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `qrcode-${identifier}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="bg-white rounded-xl border-2 border-ink/10 p-5 text-center">
      <canvas ref={canvasRef} className="mx-auto rounded-lg" />
      <p className="font-mono font-bold text-lg mt-3 tracking-wide">
        {identifier}
      </p>
      <p className="text-xs text-ink/50 mt-1 mb-4">
        À coller sur l&apos;objet, ou recopiez simplement l&apos;identifiant.
      </p>
      <button
        onClick={handleDownload}
        className="w-full min-h-[48px] rounded-xl bg-ink text-paper font-semibold text-sm active:bg-ink/90"
      >
        Télécharger le QR code
      </button>
    </div>
  );
}
