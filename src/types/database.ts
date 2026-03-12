// Auto-generovany typ pre Supabase schema.
// Pre produkcne pouzitie spusti: npx supabase gen types typescript --local > src/types/database.ts

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
      shop_categories: {
        Row: {
          id: string
          slug: string
          name: string
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          category_slug: string | null
          price_cents: number
          stock_quantity: number
          images: Json
          metadata: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          category_slug?: string | null
          price_cents: number
          stock_quantity?: number
          images?: Json
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          category_slug?: string | null
          price_cents?: number
          stock_quantity?: number
          images?: Json
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shop_cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          }
        ]
      }
      shop_orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          total_cents: number
          shipping_address: Json
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          total_cents: number
          shipping_address: Json
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          total_cents?: number
          shipping_address?: Json
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      shop_order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_cents: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_cents: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "shop_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    }
  }
}
