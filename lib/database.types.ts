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
      campaigns: {
        Row: {
          amount: number
          brand_name: string
          campaign_title: string
          created_at: string
          deliverables: string
          due_date: string
          id: string
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          published_date: string | null
          signed_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          brand_name: string
          campaign_title: string
          created_at?: string
          deliverables: string
          due_date: string
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          published_date?: string | null
          signed_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          brand_name?: string
          campaign_title?: string
          created_at?: string
          deliverables?: string
          due_date?: string
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          published_date?: string | null
          signed_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          campaign_id: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          expense_date: string
          id: string
          notes: string | null
          receipt_path: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          campaign_id: string | null
          client_name: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          issued_date: string
          notes: string | null
          paid_date: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
          user_id: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          creator_name: string | null
          full_name: string | null
          handle: string | null
          id: string
          updated_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      campaign_status:
        | "draft"
        | "negotiating"
        | "confirmed"
        | "in_progress"
        | "submitted"
        | "completed"
        | "cancelled"
      expense_category:
        | "equipment"
        | "software"
        | "meals"
        | "transport"
        | "props"
        | "services"
        | "other"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "void"
      payment_status: "unpaid" | "partial" | "paid" | "overdue"
    }
    CompositeTypes: Record<string, never>
  }
}
