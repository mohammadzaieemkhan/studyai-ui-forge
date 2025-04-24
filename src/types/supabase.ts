
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: string
          user_id: string
          name: string
          subject_code?: string | null
          color_code?: string | null
          icon_name?: string | null
          description?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          subject_code?: string | null
          color_code?: string | null
          icon_name?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          subject_code?: string | null
          color_code?: string | null
          icon_name?: string | null
          description?: string | null
          created_at?: string
        }
      }
      study_materials: {
        Row: {
          material_id: string
          user_id: string
          subject_id?: string | null
          title: string
          description?: string | null
          content_type: string
          content?: string | null
          file_path?: string | null
          created_at: string
          last_modified: string
          is_public: boolean
        }
        Insert: {
          material_id?: string
          user_id: string
          subject_id?: string | null
          title: string
          description?: string | null
          content_type: string
          content?: string | null
          file_path?: string | null
          created_at?: string
          last_modified?: string
          is_public?: boolean
        }
        Update: {
          material_id?: string
          user_id?: string
          subject_id?: string | null
          title?: string
          description?: string | null
          content_type?: string
          content?: string | null
          file_path?: string | null
          created_at?: string
          last_modified?: string
          is_public?: boolean
        }
      }
      smart_notes: {
        Row: {
          note_id: string
          user_id: string
          material_id?: string | null
          title: string
          content: string
          created_at: string
          last_modified: string
          ai_generated: boolean
        }
        Insert: {
          note_id?: string
          user_id: string
          material_id?: string | null
          title: string
          content: string
          created_at?: string
          last_modified?: string
          ai_generated?: boolean
        }
        Update: {
          note_id?: string
          user_id?: string
          material_id?: string | null
          title?: string
          content?: string
          created_at?: string
          last_modified?: string
          ai_generated?: boolean
        }
      }
      // Add other table types here following the same pattern
    }
  }
}
