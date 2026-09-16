export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cohorts: {
        Row: {
          city: string | null
          created_at: string
          days: number
          end_date: string | null
          highlights: string[]
          highlights_en: string[]
          id: string
          is_active: boolean
          is_public: boolean
          location: string | null
          name: string
          slug: string
          sort_order: number
          start_date: string | null
          summary: string | null
          summary_en: string | null
          tagline: string | null
          tagline_en: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          days?: number
          end_date?: string | null
          highlights?: string[]
          highlights_en?: string[]
          id?: string
          is_active?: boolean
          is_public?: boolean
          location?: string | null
          name: string
          slug: string
          sort_order?: number
          start_date?: string | null
          summary?: string | null
          summary_en?: string | null
          tagline?: string | null
          tagline_en?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          days?: number
          end_date?: string | null
          highlights?: string[]
          highlights_en?: string[]
          id?: string
          is_active?: boolean
          is_public?: boolean
          location?: string | null
          name?: string
          slug?: string
          sort_order?: number
          start_date?: string | null
          summary?: string | null
          summary_en?: string | null
          tagline?: string | null
          tagline_en?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          available_all_days: boolean
          cohort_id: string | null
          created_at: string
          dev_role: string | null
          email: string
          experience_level: string
          full_name: string
          group_name: string | null
          hackathon_choice: string
          has_laptop: boolean
          id: string
          languages: string[] | null
          motivation: string | null
          phone: string | null
          problem_idea: string | null
          profession: string | null
          status: string
        }
        Insert: {
          available_all_days?: boolean
          cohort_id?: string | null
          created_at?: string
          dev_role?: string | null
          email: string
          experience_level?: string
          full_name: string
          group_name?: string | null
          hackathon_choice?: string
          has_laptop?: boolean
          id?: string
          languages?: string[] | null
          motivation?: string | null
          phone?: string | null
          problem_idea?: string | null
          profession?: string | null
          status?: string
        }
        Update: {
          available_all_days?: boolean
          cohort_id?: string | null
          created_at?: string
          dev_role?: string | null
          email?: string
          experience_level?: string
          full_name?: string
          group_name?: string | null
          hackathon_choice?: string
          has_laptop?: boolean
          id?: string
          languages?: string[] | null
          motivation?: string | null
          phone?: string | null
          problem_idea?: string | null
          profession?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_slots: {
        Row: {
          cohort_id: string | null
          created_at: string
          day: number
          end_time: string | null
          id: string
          sort_order: number
          speaker_id: string | null
          start_time: string
          theme: string | null
          theme_en: string | null
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string
          day: number
          end_time?: string | null
          id?: string
          sort_order?: number
          speaker_id?: string | null
          start_time: string
          theme?: string | null
          theme_en?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          cohort_id?: string | null
          created_at?: string
          day?: number
          end_time?: string | null
          id?: string
          sort_order?: number
          speaker_id?: string | null
          start_time?: string
          theme?: string | null
          theme_en?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_slots_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_slots_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      speakers: {
        Row: {
          avatar_url: string | null
          bio: string | null
          bio_en: string | null
          cohort_id: string | null
          created_at: string
          id: string
          name: string
          role: string | null
          role_en: string | null
          sort_order: number
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bio_en?: string | null
          cohort_id?: string | null
          created_at?: string
          id?: string
          name: string
          role?: string | null
          role_en?: string | null
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bio_en?: string | null
          cohort_id?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: string | null
          role_en?: string | null
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "speakers_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
