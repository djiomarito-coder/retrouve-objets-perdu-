"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

export default function InscriptionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("Un compte existe déjà avec cet email. Connectez-vous plutôt.");
      } else {
        setError("Impossible de créer le compte. Vérifiez vos informations.");
      }
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
        <Alert type="success">
          Votre compte a été créé. Si une confirmation par email est
          demandée, vérifiez votre boîte de réception avant de vous
          connecter.
        </Alert>
        <Link href="/connexion">
          <Button variant="primary" className="mt-2">
            Aller à la connexion
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
      <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
      <p className="text-ink/60 text-sm mb-6">
        Quelques secondes suffisent pour commencer à enregistrer vos objets.
      </p>

      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Field
          id="email"
          label="Adresse email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          id="password"
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Field
          id="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" loading={loading} className="mt-2">
          Créer mon compte
        </Button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-safe font-semibold">
          Se connecter
        </Link>
      </p>
    </main>
  );
}
