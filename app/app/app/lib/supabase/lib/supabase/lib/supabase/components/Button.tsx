import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

// Bouton unique réutilisé partout dans l'app : garantit que chaque
// bouton a la même taille tactile confortable et le même style.
export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "w-full min-h-[52px] rounded-xl font-semibold text-base px-6 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-ink text-paper active:bg-ink/90",
    secondary: "bg-white text-ink border-2 border-ink/10 active:bg-ink/5",
    danger: "bg-alert text-white active:bg-alert/90",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
