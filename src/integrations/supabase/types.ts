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
      calculated_taxes: {
        Row: {
          company_id: string
          created_at: string
          das_amount: number
          id: string
          inss_amount: number
          payment_month: number
          payment_year: number
          pro_labore_amount: number
          reference_month: number
          reference_year: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          das_amount?: number
          id?: string
          inss_amount?: number
          payment_month: number
          payment_year: number
          pro_labore_amount?: number
          reference_month: number
          reference_year: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          das_amount?: number
          id?: string
          inss_amount?: number
          payment_month?: number
          payment_year?: number
          pro_labore_amount?: number
          reference_month?: number
          reference_year?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculated_taxes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          accounting_fee: number | null
          company_id: string
          created_at: string
          das_percentage: number
          id: string
          inss_percentage: number
          pro_labore_percentage: number
          updated_at: string
        }
        Insert: {
          accounting_fee?: number | null
          company_id: string
          created_at?: string
          das_percentage?: number
          id?: string
          inss_percentage?: number
          pro_labore_percentage?: number
          updated_at?: string
        }
        Update: {
          accounting_fee?: number | null
          company_id?: string
          created_at?: string
          das_percentage?: number
          id?: string
          inss_percentage?: number
          pro_labore_percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_revenue: {
        Row: {
          company_id: string
          created_at: string
          id: string
          month: number
          total_revenue: number
          updated_at: string
          year: number
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          month: number
          total_revenue?: number
          updated_at?: string
          year: number
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          month?: number
          total_revenue?: number
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_revenue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          company_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_auto_generated: boolean | null
          month: number
          payment_date: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          title: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          year: number
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          company_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_auto_generated?: boolean | null
          month: number
          payment_date?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          title: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          year: number
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["transaction_category"]
          company_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_auto_generated?: boolean | null
          month?: number
          payment_date?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          title?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_company_id_fkey"
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
      calculate_automatic_transactions: {
        Args: {
          p_company_id: string
          p_month: number
          p_year: number
          p_revenue?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      transaction_category:
        | "salary"
        | "pro_labore"
        | "profit_distribution"
        | "das"
        | "inss"
        | "accounting"
        | "other_expense"
        | "other_income"
      transaction_status: "pending" | "completed"
      transaction_type: "income" | "expense"
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
      transaction_category: [
        "salary",
        "pro_labore",
        "profit_distribution",
        "das",
        "inss",
        "accounting",
        "other_expense",
        "other_income",
      ],
      transaction_status: ["pending", "completed"],
      transaction_type: ["income", "expense"],
    },
  },
} as const
