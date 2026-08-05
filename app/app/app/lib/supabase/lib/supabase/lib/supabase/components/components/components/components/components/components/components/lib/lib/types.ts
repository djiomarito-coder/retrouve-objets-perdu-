export type ObjectStatus = "possede" | "perdu" | "retrouve";

export type ObjectRow = {
  id: string;
  user_id: string;
  identifier: string;
  name: string;
  description: string;
  photo_path: string | null;
  status: ObjectStatus;
  contact_message: string | null;
  created_at: string;
  updated_at: string;
};
