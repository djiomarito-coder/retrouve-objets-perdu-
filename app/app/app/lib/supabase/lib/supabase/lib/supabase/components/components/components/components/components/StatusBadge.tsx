type Status = "possede" | "perdu" | "retrouve";

const config: Record<Status, { label: string; className: string }> = {
  possede: { label: "En sécurité", className: "bg-safe/10 text-safe" },
  perdu: { label: "Perdu", className: "bg-alert/10 text-alert" },
  retrouve: { label: "Retrouvé", className: "bg-kraft/20 text-ink/70" },
};

// Utilisé partout où un statut d'objet doit être affiché,
// pour garder une couleur et un libellé cohérents dans toute l'app.
export default function StatusBadge({ status }: { status: Status }) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${className}`}
    >
      {label}
    </span>
  );
}
