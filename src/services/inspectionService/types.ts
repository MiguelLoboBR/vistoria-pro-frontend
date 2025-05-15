
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
