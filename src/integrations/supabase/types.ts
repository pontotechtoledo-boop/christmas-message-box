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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity: string | null
          entity_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          button_label: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          eyebrow: string | null
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string | null
          priority: number
          starts_at: string | null
          title: string
        }
        Insert: {
          button_label?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          priority?: number
          starts_at?: string | null
          title: string
        }
        Update: {
          button_label?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          priority?: number
          starts_at?: string | null
          title?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          coupon_id: string | null
          created_at: string
          ends_at: string | null
          headline: string
          id: string
          is_active: boolean
          message: string
          name: string
          starts_at: string | null
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          ends_at?: string | null
          headline?: string
          id?: string
          is_active?: boolean
          message?: string
          name: string
          starts_at?: string | null
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          ends_at?: string | null
          headline?: string
          id?: string
          is_active?: boolean
          message?: string
          name?: string
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_adult: boolean
          is_kids: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_adult?: boolean
          is_kids?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_adult?: boolean
          is_kids?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      combos: {
        Row: {
          combo_price: number
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean
          max_redemptions: number | null
          name: string
          product_ids: string[]
          redemption_count: number
          starts_at: string | null
        }
        Insert: {
          combo_price: number
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          name: string
          product_ids: string[]
          redemption_count?: number
          starts_at?: string | null
        }
        Update: {
          combo_price?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          name?: string
          product_ids?: string[]
          redemption_count?: number
          starts_at?: string | null
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          email: string
          id: string
          order_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          email: string
          id?: string
          order_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          email?: string
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          category_ids: string[]
          code: string
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          max_redemptions: number | null
          minimum_order: number
          per_customer_limit: number | null
          product_ids: string[]
          redemption_count: number
          starts_at: string | null
        }
        Insert: {
          category_ids?: string[]
          code: string
          created_at?: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          minimum_order?: number
          per_customer_limit?: number | null
          product_ids?: string[]
          redemption_count?: number
          starts_at?: string | null
        }
        Update: {
          category_ids?: string[]
          code?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          minimum_order?: number
          per_customer_limit?: number | null
          product_ids?: string[]
          redemption_count?: number
          starts_at?: string | null
        }
        Relationships: []
      }
      discount_tiers: {
        Row: {
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          label: string
          min_subtotal: number
          starts_at: string | null
        }
        Insert: {
          created_at?: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          label?: string
          min_subtotal: number
          starts_at?: string | null
        }
        Update: {
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          label?: string
          min_subtotal?: number
          starts_at?: string | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          order_id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          combo_id: string | null
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          combo_id?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          combo_id?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "combos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          campaign_id: string | null
          coupon_id: string | null
          created_at: string
          customer_name: string | null
          discount_breakdown: Json
          discount_total: number
          email: string
          environment: string
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          coupon_id?: string | null
          created_at?: string
          customer_name?: string | null
          discount_breakdown?: Json
          discount_total?: number
          email: string
          environment?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          coupon_id?: string | null
          created_at?: string
          customer_name?: string | null
          discount_breakdown?: Json
          discount_total?: number
          email?: string
          environment?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string | null
          provider: string
          provider_ref: string | null
          raw: Json | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id?: string | null
          provider?: string
          provider_ref?: string | null
          raw?: Json | null
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string | null
          provider?: string
          provider_ref?: string | null
          raw?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_recommendations: {
        Row: {
          id: string
          is_active: boolean
          kind: string
          priority: number
          product_id: string
          recommended_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          kind?: string
          priority?: number
          product_id: string
          recommended_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          kind?: string
          priority?: number
          product_id?: string
          recommended_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recommendations_recommended_id_fkey"
            columns: ["recommended_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          details: string[]
          file_path: string | null
          format: string
          gallery: string[]
          id: string
          image_url: string | null
          is_adult: boolean
          is_featured: boolean
          is_new: boolean
          is_on_sale: boolean
          name: string
          price: number
          promo_price: number | null
          published_at: string | null
          short_description: string
          show_on_home: boolean
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
          usage_instructions: string | null
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string
          details?: string[]
          file_path?: string | null
          format?: string
          gallery?: string[]
          id?: string
          image_url?: string | null
          is_adult?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_on_sale?: boolean
          name: string
          price?: number
          promo_price?: number | null
          published_at?: string | null
          short_description?: string
          show_on_home?: boolean
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          usage_instructions?: string | null
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          details?: string[]
          file_path?: string | null
          format?: string
          gallery?: string[]
          id?: string
          image_url?: string | null
          is_adult?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_on_sale?: boolean
          name?: string
          price?: number
          promo_price?: number | null
          published_at?: string | null
          short_description?: string
          show_on_home?: boolean
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          usage_instructions?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          id: string
          processed_at: string
          type: string
        }
        Insert: {
          id: string
          processed_at?: string
          type: string
        }
        Update: {
          id?: string
          processed_at?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_campaign: {
        Args: never
        Returns: {
          code: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          ends_at: string
          headline: string
          id: string
          message: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      discount_type: "percent" | "fixed"
      order_status: "pending" | "paid" | "failed" | "canceled" | "refunded"
      product_status: "draft" | "published" | "inactive"
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
      app_role: ["admin", "customer"],
      discount_type: ["percent", "fixed"],
      order_status: ["pending", "paid", "failed", "canceled", "refunded"],
      product_status: ["draft", "published", "inactive"],
    },
  },
} as const
