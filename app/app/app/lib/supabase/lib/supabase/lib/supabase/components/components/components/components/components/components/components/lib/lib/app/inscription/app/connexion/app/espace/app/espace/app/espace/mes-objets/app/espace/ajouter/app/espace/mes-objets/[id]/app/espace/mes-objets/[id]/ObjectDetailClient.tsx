"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import { Field, TextAreaField } from "@/components/Field";
import { Alert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import QrCodeBox from "@/components/QrCodeBox";
import { formatDate } from "@/lib/utils";
import type { ObjectRow, ObjectStatus } from "@/lib/types";

export default function ObjectDetailClient({
  object,
  photoUrl,
}: {
  object: ObjectRow;
  photoUrl: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(object.name);
  const [description, setDescription] = useState(object.description);
  const [contactMessage, setContactMessage] = useState(object.contact_message ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: updateError } = await supabase
      .from("objects")
      .update({
        name: name.trim(),
        description: description.trim(),
        contact_message: contactMessage.trim() || null,
      })
      .eq("id", object.id);

    setLoading(false);

    if (updateError) {
      setError("Impossible d'enregistrer les modifications.");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function handleStatusChange(newStatus: ObjectStatus) {
    setLoading(true);
    setError("");

    const { error: updateError } = await supabase
      .from("objects")
      .update({ status: newStatus })
      .eq("id", object.id);

    setLoading(false);

    if (updateError) {
      setError("Impossible de mettre à jour le statut.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    setError("");

    if (object.photo_path) {
      await supabase.storage.from("object-photos").remove([object.photo_path]);
    }

    const { error: deleteError } = await supabase
      .from("objects")
      .delete()
      .eq("id", object.id);

    setLoading(false);

    if (deleteError) {
      setError("Impossible de supprimer l'objet.");
      return;
    }

    router.push("/espace/mes-objets");
    router.refresh();
  }

  if (editing) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Modifier l&apos;objet</h1>
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={handleSave}>
          <Field
            id="name"
            label="Nom de l'objet"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextAreaField
            id="description"
            label="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextAreaField
            id="contactMessage"
            label="Message affiché si l'objet est retrouvé"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
          />
          <div className="space-y-3 mt-4">
            <Button type="submit" loading={loading}>
              Enregistrer les modifications
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert type="error">{error}</Alert>}

      {photoUrl ? (
        <img
          src={photoUrl}
          alt={object.name}
          className="w-full h-56 object-cover rounded-xl mb-4 border-2 border-ink/10"
        />
      ) : (
        <div className="w-full h-40 rounded-xl bg-ink/5 flex items-center justify-center text-4xl mb-4">
          📦
        </div>
      )}

      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-bold">{object.name}</h1>
        <StatusBadge status={object.status} />
      </div>
      <p className="text-xs text-ink/40 mb-4">
        Ajouté le {formatDate(object.created_at)}
      </p>

      <p className="text-ink/80 mb-6">{object.description}</p>

      <div className="bg-white rounded-xl border-2 border-ink/10 p-4 mb-6">
        <p className="text-xs font-semibold text-ink/50 mb-1">IDENTIFIANT</p>
        <p className="font-mono font-bold text-lg">{object.identifier}</p>
      </div>

      <div className="mb-6">
        <QrCodeBox identifier={object.identifier} />
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold mb-2 text-ink/70">Statut</p>
        <div className="grid grid-cols-1 gap-2">
          {object.status !== "perdu" && (
            <Button
              variant="danger"
              onClick={() => handleStatusChange("perdu")}
              loading={loading}
            >
              Déclarer perdu
            </Button>
          )}
          {object.status === "perdu" && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange("retrouve")}
              loading={loading}
            >
              Marquer comme retrouvé
            </Button>
          )}
          {object.status !== "possede" && (
            <Button
              variant="secondary"
              onClick={() => handleStatusChange("possede")}
              loading={loading}
            >
              Remettre en sécurité
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Modifier
        </Button>

        {!confirmDelete ? (
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Supprimer cet objet
          </Button>
        ) : (
          <div className="bg-alert/5 border-2 border-alert/20 rounded-xl p-4">
            <p className="text-sm font-semibold mb-3">
              Confirmez-vous la suppression définitive de cet objet ?
            </p>
            <div className="space-y-2">
              <Button variant="danger" onClick={handleDelete} loading={loading}>
                Oui, supprimer
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
