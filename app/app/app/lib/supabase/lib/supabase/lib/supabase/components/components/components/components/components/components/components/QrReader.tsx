"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const SCANNER_ELEMENT_ID = "qr-reader-zone";

export default function QrReader({
  onResult,
  onError,
}: {
  onResult: (text: string) => void;
  onError: () => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState("Activation de la caméra...");

  useEffect(() => {
    let isMounted = true;
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (!isMounted) return;
          scanner.stop().catch(() => {});
          onResult(decodedText);
        },
        () => {
          // Erreurs de décodage image par image : normal, on ignore.
        }
      )
      .then(() => {
        if (isMounted) setStatus("Placez le QR code dans le cadre.");
      })
      .catch(() => {
        if (isMounted) onError();
      });

    return () => {
      isMounted = false;
      scanner.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        id={SCANNER_ELEMENT_ID}
        className="w-full rounded-xl overflow-hidden border-2 border-ink/10 bg-black"
      />
      <p className="text-center text-sm text-ink/50 mt-2">{status}</p>
    </div>
  );
}
