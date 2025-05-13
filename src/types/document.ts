export interface Document {
  id: number;
  name: string;
  file_path: string;
  otdel_id: number | null;
  uploaded_by: number;
  uploaded_at: Date;
  description: string | null;
}
