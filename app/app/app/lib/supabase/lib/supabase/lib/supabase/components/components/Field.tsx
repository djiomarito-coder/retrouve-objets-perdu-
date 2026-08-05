import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

// Champ de formulaire standard (input). Utilisé partout pour garder
// une apparence identique et un espacement tactile confortable.
export function Field({ label, error, id, className = "", ...props }: FieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-1.5 text-ink/80">
        {label}
      </label>
      <input
        id={id}
        className={`w-full min-h-[52px] px-4 rounded-xl border-2 text-base bg-white ${
          error ? "border-alert" : "border-ink/10"
        } focus:outline-none focus:border-safe ${className}`}
        {...props}
      />
      {error && <p className="text-alert text-sm mt-1.5">{error}</p>}
    </div>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

// Variante zone de texte, pour les descriptions.
export function TextAreaField({
  label,
  error,
  id,
  className = "",
  ...props
}: TextAreaFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-1.5 text-ink/80">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={`w-full px-4 py-3 rounded-xl border-2 text-base bg-white resize-none ${
          error ? "border-alert" : "border-ink/10"
        } focus:outline-none focus:border-safe ${className}`}
        {...props}
      />
      {error && <p className="text-alert text-sm mt-1.5">{error}</p>}
    </div>
  );
}
