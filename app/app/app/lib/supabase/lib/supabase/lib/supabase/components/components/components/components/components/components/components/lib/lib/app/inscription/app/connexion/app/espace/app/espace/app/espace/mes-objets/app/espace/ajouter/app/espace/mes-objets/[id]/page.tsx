import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ObjectRow } from "@/lib/types";
import ObjectDetailClient from "./ObjectDetailClient";

export default async function ObjetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: object } = await supabase
    .from("objects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!object) {
    notFound();
  }

  let photoUrl: string | null = null;
  if ((object as ObjectRow).photo_path) {
    const { data: signed } = await supabase.storage
      .from("object-photos")
      .createSignedUrl((object as ObjectRow).photo_path!, 3600);
    photoUrl = signed?.signedUrl ?? null;
  }

  return <ObjectDetailClient object={object as ObjectRow} photoUrl={photoUrl} />;
}
