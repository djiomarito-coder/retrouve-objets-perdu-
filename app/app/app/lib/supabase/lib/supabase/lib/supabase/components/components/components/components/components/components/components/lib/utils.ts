// Génère un identifiant lisible et sans caractères ambigus (pas de 0/O/1/I/L)
// pour éviter les erreurs de recopie manuelle sur l'objet physique.
export function generateIdentifier(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ROP-${code}`;
}

// Normalise une saisie d'identifiant : espaces, casse, variations du tiret.
export function normalizeIdentifier(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
