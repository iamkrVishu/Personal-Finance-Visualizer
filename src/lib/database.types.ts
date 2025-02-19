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
      transactions: {
        Row: {
          id: string
          amount: number
          description: string
          date: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          amount: number
          description: string
          date: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          date?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}