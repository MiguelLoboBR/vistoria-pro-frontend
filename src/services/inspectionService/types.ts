
export interface Inspection {
  id: string;
  address: string;
  date: string;
  time: string | null;
  status: "agendada" | "atrasada" | "em_andamento" | "concluida";
  inspector_id: string | null;
  inspector_name?: string;
  type: string;
  company_id: string;
  created_at: string;
  updated_at?: string;
}

export interface InspectionStats {
  total: number;
  agendada: number;
  atrasada: number;
  emAndamento: number;
  concluida: number;
}

// New types for inspection execution
export interface InspectionRoom {
  id: string;
  inspection_id: string;
  name: string;
  order_index: number | null;
  created_at: string;
  items?: InspectionItem[];
}

export interface InspectionItem {
  id: string;
  room_id: string;
  label: string | null;
  state: "ok" | "danificado" | "observacao" | null;
  observation: string | null;
  transcription: string | null;
  created_at: string;
  medias?: InspectionMedia[];
}

export interface InspectionMedia {
  id: string;
  item_id: string;
  type: "foto" | "video";
  url: string | null;
  edited_url: string | null;
  latitude: number | null;
  longitude: number | null;
  timestamp: string | null;
  created_at: string;
}

export interface InspectionSignature {
  id: string;
  inspection_id: string;
  signer: "vistoriador" | "responsavel";
  signature_data: string | null;
  created_at: string;
}
