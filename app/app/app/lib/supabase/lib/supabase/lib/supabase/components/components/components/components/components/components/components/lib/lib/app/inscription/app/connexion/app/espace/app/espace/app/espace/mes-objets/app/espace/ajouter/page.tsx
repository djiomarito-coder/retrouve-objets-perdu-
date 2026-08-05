"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import { Field, TextAreaField } from "@/components/Field";
import { Alert } from "@/components/Alert";
import QrCodeBox from "@/components/QrCodeBox";
import { generateIdentifier } from "@/lib/utils";

export default function AjouterObjetPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdIdentifier, setCreatedIdentifier] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !description.trim()) {
      setError("Le nom et la description sont obligatoires.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Votre session a expiré. Reconnectez-vous.");
      setLoading(false);
      return;
    }

    // Génération de l'identifiant avec vérification d'unicité (rare collision).
    let identifier = generateIdentifier();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: existing } = await supabase
        .from("objects")
        .select("id")
        .eq("identifier", identifier)
        .maybeSingle();
      if (!existing) break;
      identifier = generateIdentifier();
    }

    // Upload de la photo si présente, dans le dossier propre à l'utilisateur
    // (obligatoire pour respecter la policy Storage : {user_id}/...)
    let photoPath: string | null = null;
    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const filePath = `${user.id}/${identifier}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("object-photos")
        .upload(filePath, photoFile, { upsert: true });

      if (uploadError) {
        setError("La photo n'a pas pu être envoyée. Vous pouvez réessayer sans photo pour l'instant.");
        setLoading(false);
        return;
      }
      photoPath = filePath;
    }

    const { error: insertError } = await supabase.from("objects").insert({
      user_id: user.id,
      identifier,
      name: name.trim(),
      description: description.trim(),
      photo_path: photoPath,
      contact_message: contactMessage.trim() || null,
      status: "possede",
    });

    setLoading(false);

    if (insertError) {
      setError("Impossible d'enregistrer l'objet. Réessayez.");
      return;
    }

    setCreatedIdentifier(identifier);
  }

  if (createdIdentifier) {
    return (
      <div>
        <Alert type="success">Objet enregistré avec succès !</Alert>
        <QrCodeBox identifier={createdIdentifier} />
        <div className="mt-4 space-y-3">
          <Button variant="secondary" onClick={() => router.push("/espace/mes-objets")}>
            Voir mes objets
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setCreatedIdentifier(null);
              setName("");
              setDescription("");
              setContactMessage("");
              setPhotoFile(null);
              setPhotoPreview(null);
            }}
          >
            Ajouter un autre objet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Ajouter un objet</h1>
      <p className="text-ink/60 text-sm mb-6">
        Un identifiant unique sera généré automatiquement à la validation.
      </p>

      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Field
          id="name"
          label="Nom de l'objet"
          placeholder="Ex. Chargeur Samsung"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextAreaField
          id="description"
          label="Description"
          placeholder="Couleur, marque, signes distinctifs..."
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1.5 text-ink/80">
            Photo (facultatif)
          </label>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Aperçu"
              className="w-full h-48 object-cover rounded-xl mb-2 border-2 border-ink/10"
            />
          )}
          <label className="flex items-center justify-center min-h-[52px] rounded-xl border-2 border-dashed border-ink/20 text-sm font-semibold text-ink/60 cursor-pointer active:bg-ink/5">
            {photoFile ? "Changer la photo" : "Choisir une photo"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        <TextAreaField
          id="contactMessage"
          label="Message affiché si l'objet est retrouvé (facultatif)"
          placeholder="Ex. Merci de me contacter par SMS au 06..."
          value={contactMessage}
          onChange={(e) => setContactMessage(e.target.value)}
        />
        <p className="text-xs text-ink/50 -mt-3 mb-4">
          Ce message n&apos;apparaît que si vous déclarez l&apos;objet perdu.
          Rien n&apos;est visible publiquement tant qu&apos;il est marqué
          &laquo;&nbsp;en sécurité&nbsp;&raquo;.
        </p>

        <Button type="submit" loading={loading} className="mt-2">
          Enregistrer
        </Button>
      </form>
    </div>
  );
      }
