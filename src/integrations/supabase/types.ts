export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          admin_id: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          is_individual: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_id?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_individual?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_id?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_individual?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_admin_profile"
            columns: ["admin_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_items: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          observation: string | null
          room_id: string | null
          state: string | null
          transcription: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          observation?: string | null
          room_id?: string | null
          state?: string | null
          transcription?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          observation?: string | null
          room_id?: string | null
          state?: string | null
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_items_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "inspection_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_medias: {
        Row: {
          created_at: string | null
          edited_url: string | null
          id: string
          item_id: string | null
          latitude: number | null
          longitude: number | null
          timestamp: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          edited_url?: string | null
          id?: string
          item_id?: string | null
          latitude?: number | null
          longitude?: number | null
          timestamp?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          edited_url?: string | null
          id?: string
          item_id?: string | null
          latitude?: number | null
          longitude?: number | null
          timestamp?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_medias_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inspection_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_rooms: {
        Row: {
          created_at: string | null
          id: string
          inspection_id: string | null
          name: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inspection_id?: string | null
          name: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inspection_id?: string | null
          name?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_rooms_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_signatures: {
        Row: {
          created_at: string | null
          id: string
          inspection_id: string | null
          signature_data: string | null
          signer: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inspection_id?: string | null
          signature_data?: string | null
          signer?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inspection_id?: string | null
          signature_data?: string | null
          signer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_signatures_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          address: string
          company_id: string
          created_at: string
          date: string
          id: string
          inspector_id: string | null
          status: string
          time: string | null
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          company_id: string
          created_at?: string
          date: string
          id?: string
          inspector_id?: string | null
          status?: string
          time?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string
          company_id?: string
          created_at?: string
          date?: string
          id?: string
          inspector_id?: string | null
          status?: string
          time?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          cpf: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_inspector_to_company: {
        Args: { inspector_id: string; company_id: string }
        Returns: undefined
      }
      create_company_register: {
        Args:
          | {
              company_name: string
              company_cnpj: string
              company_address: string
              company_phone: string
              company_email: string
              admin_name: string
              admin_cpf: string
              admin_phone: string
              admin_email: string
              company_logo_url?: string
            }
          | {
              new_user_id: string
              company_name: string
              company_cnpj: string
              company_address: string
              company_phone: string
              company_email: string
              company_logo_url: string
              admin_name: string
              admin_cpf: string
              admin_phone: string
            }
          | {
              new_user_id: string
              company_name: string
              company_cnpj: string
              company_address: string
              company_phone: string
              company_email: string
              company_logo_url: string
              admin_name: string
              admin_cpf: string
              admin_phone: string
              admin_email: string
            }
        Returns: string
      }
      create_company_with_admin: {
        Args:
          | { company_name: string; company_cnpj: string; admin_id: string }
          | {
              company_name: string
              company_cnpj: string
              admin_id: string
              company_address?: string
              company_phone?: string
              company_email?: string
              company_logo_url?: string
              admin_name?: string
              admin_cpf?: string
              admin_phone?: string
              admin_email?: string
            }
        Returns: string
      }
      create_individual_profile: {
        Args: {
          full_name: string
          cpf: string
          user_id: string
          address: string
          phone: string
          email: string
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role_safely: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_of_company: {
        Args: { company_uuid: string }
        Returns: boolean
      }
      is_company_admin: {
        Args: { company_id: string }
        Returns: boolean
      }
      is_same_company: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "inspector" | "admin_master" | "admin_tenant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "inspector", "admin_master", "admin_tenant"],
    },
  },
} as const
