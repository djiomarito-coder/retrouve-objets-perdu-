"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/espace");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
      <h1 className="text-2xl font-bold mb-2">Se connecter</h1>
      <p className="text-ink/60 text-sm mb-6">
        Accédez à votre espace pour gérer vos objets.
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" loading={loading} className="mt-2">
          Se connecter
        </Button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-safe font-semibold">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}
