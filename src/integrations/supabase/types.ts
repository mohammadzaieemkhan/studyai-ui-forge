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
      activity_log: {
        Row: {
          activity_type: string
          description: string | null
          log_id: number
          reference_id: number | null
          reference_type: string | null
          timestamp: string | null
          user_id: number | null
        }
        Insert: {
          activity_type: string
          description?: string | null
          log_id?: number
          reference_id?: number | null
          reference_type?: string | null
          timestamp?: string | null
          user_id?: number | null
        }
        Update: {
          activity_type?: string
          description?: string | null
          log_id?: number
          reference_id?: number | null
          reference_type?: string | null
          timestamp?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ai_request_log: {
        Row: {
          api_key_used: string | null
          error_message: string | null
          prompt: string | null
          request_id: number
          request_type: string | null
          response_summary: string | null
          status: string | null
          timestamp: string | null
          tokens_used: number | null
          user_id: number | null
        }
        Insert: {
          api_key_used?: string | null
          error_message?: string | null
          prompt?: string | null
          request_id?: number
          request_type?: string | null
          response_summary?: string | null
          status?: string | null
          timestamp?: string | null
          tokens_used?: number | null
          user_id?: number | null
        }
        Update: {
          api_key_used?: string | null
          error_message?: string | null
          prompt?: string | null
          request_id?: number
          request_type?: string | null
          response_summary?: string | null
          status?: string | null
          timestamp?: string | null
          tokens_used?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_request_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ai_summaries: {
        Row: {
          ai_model: string | null
          content: string
          generated_at: string | null
          material_id: number | null
          prompt_used: string | null
          summary_id: number
          title: string
          user_id: number | null
        }
        Insert: {
          ai_model?: string | null
          content: string
          generated_at?: string | null
          material_id?: number | null
          prompt_used?: string | null
          summary_id?: number
          title: string
          user_id?: number | null
        }
        Update: {
          ai_model?: string | null
          content?: string
          generated_at?: string | null
          material_id?: number | null
          prompt_used?: string | null
          summary_id?: number
          title?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_summaries_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["material_id"]
          },
          {
            foreignKeyName: "ai_summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          is_active: boolean | null
          key_id: number
          key_name: string
          key_value: string
          last_used: string | null
          service_name: string
        }
        Insert: {
          created_at?: string | null
          is_active?: boolean | null
          key_id?: number
          key_name: string
          key_value: string
          last_used?: string | null
          service_name: string
        }
        Update: {
          created_at?: string | null
          is_active?: boolean | null
          key_id?: number
          key_name?: string
          key_value?: string
          last_used?: string | null
          service_name?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          exam_id: number
          is_ai_generated: boolean | null
          is_draft: boolean | null
          passing_score: number | null
          subject_id: number | null
          time_limit_minutes: number | null
          title: string
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          exam_id?: number
          is_ai_generated?: boolean | null
          is_draft?: boolean | null
          passing_score?: number | null
          subject_id?: number | null
          time_limit_minutes?: number | null
          title: string
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          exam_id?: number
          is_ai_generated?: boolean | null
          is_draft?: boolean | null
          passing_score?: number | null
          subject_id?: number | null
          time_limit_minutes?: number | null
          title?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
          {
            foreignKeyName: "exams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      material_tags: {
        Row: {
          material_id: number
          tag_id: number
        }
        Insert: {
          material_id: number
          tag_id: number
        }
        Update: {
          material_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_tags_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["material_id"]
          },
          {
            foreignKeyName: "material_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      options: {
        Row: {
          explanation: string | null
          is_correct: boolean | null
          option_id: number
          option_text: string
          question_id: number | null
        }
        Insert: {
          explanation?: string | null
          is_correct?: boolean | null
          option_id?: number
          option_text: string
          question_id?: number | null
        }
        Update: {
          explanation?: string | null
          is_correct?: boolean | null
          option_id?: number
          option_text?: string
          question_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      performance_analytics: {
        Row: {
          analytics_id: number
          average_score: number | null
          generated_at: string | null
          highest_score: number | null
          lowest_score: number | null
          period_end: string | null
          period_start: string | null
          proficiency_level: string | null
          subject_id: number | null
          total_exams: number | null
          total_time_spent_minutes: number | null
          user_id: number | null
        }
        Insert: {
          analytics_id?: number
          average_score?: number | null
          generated_at?: string | null
          highest_score?: number | null
          lowest_score?: number | null
          period_end?: string | null
          period_start?: string | null
          proficiency_level?: string | null
          subject_id?: number | null
          total_exams?: number | null
          total_time_spent_minutes?: number | null
          user_id?: number | null
        }
        Update: {
          analytics_id?: number
          average_score?: number | null
          generated_at?: string | null
          highest_score?: number | null
          lowest_score?: number | null
          period_end?: string | null
          period_start?: string | null
          proficiency_level?: string | null
          subject_id?: number | null
          total_exams?: number | null
          total_time_spent_minutes?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_analytics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
          {
            foreignKeyName: "performance_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      questions: {
        Row: {
          difficulty_level: string | null
          exam_id: number | null
          explanation: string | null
          is_ai_generated: boolean | null
          points: number | null
          question_id: number
          question_text: string
          question_type: string
        }
        Insert: {
          difficulty_level?: string | null
          exam_id?: number | null
          explanation?: string | null
          is_ai_generated?: boolean | null
          points?: number | null
          question_id?: number
          question_text: string
          question_type: string
        }
        Update: {
          difficulty_level?: string | null
          exam_id?: number | null
          explanation?: string | null
          is_ai_generated?: boolean | null
          points?: number | null
          question_id?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["exam_id"]
          },
        ]
      }
      saved_questions: {
        Row: {
          notes: string | null
          question_id: number
          saved_at: string | null
          user_id: number
        }
        Insert: {
          notes?: string | null
          question_id: number
          saved_at?: string | null
          user_id: number
        }
        Update: {
          notes?: string | null
          question_id?: number
          saved_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "saved_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "saved_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      scheduled_tests: {
        Row: {
          completed: boolean | null
          completed_date: string | null
          exam_id: number | null
          notes: string | null
          reminder_time: string | null
          schedule_id: number
          scheduled_date: string
          user_id: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_date?: string | null
          exam_id?: number | null
          notes?: string | null
          reminder_time?: string | null
          schedule_id?: number
          scheduled_date: string
          user_id?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_date?: string | null
          exam_id?: number | null
          notes?: string | null
          reminder_time?: string | null
          schedule_id?: number
          scheduled_date?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_tests_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["exam_id"]
          },
          {
            foreignKeyName: "scheduled_tests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      smart_notes: {
        Row: {
          ai_generated: boolean | null
          content: string
          created_at: string | null
          last_modified: string | null
          material_id: number | null
          note_id: number
          title: string
          user_id: number | null
        }
        Insert: {
          ai_generated?: boolean | null
          content: string
          created_at?: string | null
          last_modified?: string | null
          material_id?: number | null
          note_id?: number
          title: string
          user_id?: number | null
        }
        Update: {
          ai_generated?: boolean | null
          content?: string
          created_at?: string | null
          last_modified?: string | null
          material_id?: number | null
          note_id?: number
          title?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_notes_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["material_id"]
          },
          {
            foreignKeyName: "smart_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      study_materials: {
        Row: {
          content: string | null
          content_type: string
          created_at: string | null
          description: string | null
          file_path: string | null
          is_public: boolean | null
          last_modified: string | null
          material_id: number
          subject_id: number | null
          title: string
          user_id: number | null
        }
        Insert: {
          content?: string | null
          content_type: string
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          is_public?: boolean | null
          last_modified?: string | null
          material_id?: number
          subject_id?: number | null
          title: string
          user_id?: number | null
        }
        Update: {
          content?: string | null
          content_type?: string
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          is_public?: boolean | null
          last_modified?: string | null
          material_id?: number
          subject_id?: number | null
          title?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
          {
            foreignKeyName: "study_materials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subjects: {
        Row: {
          color_code: string | null
          description: string | null
          icon_name: string | null
          name: string
          subject_id: number
        }
        Insert: {
          color_code?: string | null
          description?: string | null
          icon_name?: string | null
          name: string
          subject_id?: number
        }
        Update: {
          color_code?: string | null
          description?: string | null
          icon_name?: string | null
          name?: string
          subject_id?: number
        }
        Relationships: []
      }
      tags: {
        Row: {
          category: string | null
          name: string
          tag_id: number
        }
        Insert: {
          category?: string | null
          name: string
          tag_id?: number
        }
        Update: {
          category?: string | null
          name?: string
          tag_id?: number
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          attempt_id: number
          end_time: string | null
          exam_id: number | null
          is_completed: boolean | null
          max_score: number | null
          percentage: number | null
          schedule_id: number | null
          score: number | null
          start_time: string
          time_spent_seconds: number | null
          user_id: number | null
        }
        Insert: {
          attempt_id?: number
          end_time?: string | null
          exam_id?: number | null
          is_completed?: boolean | null
          max_score?: number | null
          percentage?: number | null
          schedule_id?: number | null
          score?: number | null
          start_time: string
          time_spent_seconds?: number | null
          user_id?: number | null
        }
        Update: {
          attempt_id?: number
          end_time?: string | null
          exam_id?: number | null
          is_completed?: boolean | null
          max_score?: number | null
          percentage?: number | null
          schedule_id?: number | null
          score?: number | null
          start_time?: string
          time_spent_seconds?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["exam_id"]
          },
          {
            foreignKeyName: "test_attempts_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "scheduled_tests"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_answers: {
        Row: {
          answer_id: number
          attempt_id: number | null
          is_correct: boolean | null
          option_id: number | null
          points_awarded: number | null
          question_id: number | null
          text_answer: string | null
          time_spent_seconds: number | null
        }
        Insert: {
          answer_id?: number
          attempt_id?: number | null
          is_correct?: boolean | null
          option_id?: number | null
          points_awarded?: number | null
          question_id?: number | null
          text_answer?: string | null
          time_spent_seconds?: number | null
        }
        Update: {
          answer_id?: number
          attempt_id?: number | null
          is_correct?: boolean | null
          option_id?: number | null
          points_awarded?: number | null
          question_id?: number | null
          text_answer?: string | null
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["attempt_id"]
          },
          {
            foreignKeyName: "user_answers_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["option_id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          google_id: string | null
          is_active: boolean | null
          last_login: string | null
          password_hash: string
          profile_image_url: string | null
          theme_preference: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          google_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          password_hash: string
          profile_image_url?: string | null
          theme_preference?: string | null
          user_id?: number
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          google_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string
          profile_image_url?: string | null
          theme_preference?: string | null
          user_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
