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
      asset_documents: {
        Row: {
          asset_id: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          tenant_id: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          tenant_id: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          tenant_id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_tag: string | null
          category: string | null
          created_at: string | null
          criticality: string | null
          description: string | null
          id: string
          location: string | null
          name: string
          status: Database["public"]["Enums"]["asset_status"]
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          asset_tag?: string | null
          category?: string | null
          created_at?: string | null
          criticality?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
          status?: Database["public"]["Enums"]["asset_status"]
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          asset_tag?: string | null
          category?: string | null
          created_at?: string | null
          criticality?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: Database["public"]["Enums"]["asset_status"]
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          file_name: string
          id: string
          uploaded_at: string
          url: string
          work_order_id: string
        }
        Insert: {
          file_name: string
          id?: string
          uploaded_at?: string
          url: string
          work_order_id: string
        }
        Update: {
          file_name?: string
          id?: string
          uploaded_at?: string
          url?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_information: {
        Row: {
          billing_address: Json | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last_four: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          organization_id: string | null
          payment_method_type: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organization_id?: string | null
          payment_method_type?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organization_id?: string | null
          payment_method_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_information_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          tenant_id: string
          user_id: string | null
          work_order_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          tenant_id: string
          user_id?: string | null
          work_order_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          tenant_id?: string
          user_id?: string | null
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          note: string | null
          title: string
          work_order_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          note?: string | null
          title: string
          work_order_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          note?: string | null
          title?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation: {
        Row: {
          access_level: string | null
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          access_level?: string | null
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          access_level?: string | null
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      documentation_attachments: {
        Row: {
          created_at: string | null
          document_id: string | null
          file_name: string
          file_url: string
          id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          file_name: string
          file_url: string
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          file_name?: string
          file_url?: string
          id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_attachments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documentation_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: []
      }
      documentation_collaboration_spaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: []
      }
      documentation_documents: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string | null
          id: string
          organization_id: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          organization_id: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "documentation_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_integrations: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: []
      }
      documentation_settings: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          settings: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          settings?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          settings?: Json | null
        }
        Relationships: []
      }
      documentation_sync_configs: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          organization_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          organization_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          organization_id?: string
        }
        Relationships: []
      }
      documentation_sync_jobs: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          status?: string | null
        }
        Relationships: []
      }
      documentation_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: []
      }
      global_theme_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean
          name: string
          theme_config: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean
          name: string
          theme_config?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean
          name?: string
          theme_config?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      global_translations: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_custom: boolean | null
          language: string
          translation_key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_custom?: boolean | null
          language: string
          translation_key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_custom?: boolean | null
          language?: string
          translation_key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          min_quantity: number | null
          name: string
          quantity: number
          sku: string | null
          tenant_id: string
          unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          min_quantity?: number | null
          name: string
          quantity?: number
          sku?: string | null
          tenant_id: string
          unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          min_quantity?: number | null
          name?: string
          quantity?: number
          sku?: string | null
          tenant_id?: string
          unit_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          organization_id: string | null
          paid_at: string | null
          status: string
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          organization_id?: string | null
          paid_at?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          organization_id?: string | null
          paid_at?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          category: string
          created_at: string | null
          email_enabled: boolean | null
          id: string
          in_app_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          category: string
          created_at: string | null
          id: string
          message_template: string
          severity: string
          title_template: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          message_template: string
          severity: string
          title_template: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          message_template?: string
          severity?: string
          title_template?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          organization_id: string | null
          read_at: string | null
          severity: string
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          organization_id?: string | null
          read_at?: string | null
          severity: string
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          organization_id?: string | null
          read_at?: string | null
          severity?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          invitation_expires_at: string | null
          invitation_token: string | null
          invited_at: string | null
          invited_by: string | null
          invited_email: string | null
          joined_at: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["organization_role"]
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["organization_role"]
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["organization_role"]
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_subscriptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_themes: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          theme_overrides: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          theme_overrides?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          theme_overrides?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_themes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          branding: Json | null
          contact: Json | null
          contact_email: string | null
          contact_fax: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string
          current_subscription_id: string | null
          default_language: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          branding?: Json | null
          contact?: Json | null
          contact_email?: string | null
          contact_fax?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by: string
          current_subscription_id?: string | null
          default_language?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          branding?: Json | null
          contact?: Json | null
          contact_email?: string | null
          contact_fax?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string
          current_subscription_id?: string | null
          default_language?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_current_subscription_id_fkey"
            columns: ["current_subscription_id"]
            isOneToOne: false
            referencedRelation: "organization_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          asset_type: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_duration: number | null
          id: string
          steps: Json | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          asset_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          steps?: Json | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          asset_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          steps?: Json | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procedures_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedures_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedures_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_approval_rules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          max_amount: number | null
          min_amount: number
          name: string
          order_index: number
          required_approver_role: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_amount?: number | null
          min_amount?: number
          name: string
          order_index?: number
          required_approver_role?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_amount?: number | null
          min_amount?: number
          name?: string
          order_index?: number
          required_approver_role?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchase_order_approvals: {
        Row: {
          approved_at: string | null
          approver_id: string
          comments: string | null
          created_at: string
          id: string
          purchase_order_id: string
          rule_id: string | null
          status: string
        }
        Insert: {
          approved_at?: string | null
          approver_id: string
          comments?: string | null
          created_at?: string
          id?: string
          purchase_order_id: string
          rule_id?: string | null
          status: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string
          comments?: string | null
          created_at?: string
          id?: string
          purchase_order_id?: string
          rule_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_approvals_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "purchase_order_approval_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_line_items: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          purchase_order_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          purchase_order_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          purchase_order_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_line_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_by: string | null
          created_at: string | null
          due_date: string | null
          id: string
          line_items: Json | null
          notes: string | null
          po_number: string
          requested_by: string | null
          status: Database["public"]["Enums"]["purchase_order_status"]
          tenant_id: string
          total_amount: number | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          line_items?: Json | null
          notes?: string | null
          po_number: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["purchase_order_status"]
          tenant_id: string
          total_amount?: number | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          line_items?: Json | null
          notes?: string | null
          po_number?: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["purchase_order_status"]
          tenant_id?: string
          total_amount?: number | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      request_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          request_id: string
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          request_id: string
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          request_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_comments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          actual_cost: number | null
          asset_id: string | null
          assigned_to: string | null
          attachments: Json | null
          category: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_cost: number | null
          id: string
          location: string | null
          notes: string | null
          priority: Database["public"]["Enums"]["request_priority"]
          requested_by: string | null
          status: Database["public"]["Enums"]["request_status"]
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          asset_id?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["request_priority"]
          requested_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          asset_id?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["request_priority"]
          requested_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          clicked_result_id: string | null
          clicked_result_type: string | null
          created_at: string
          entity_types: string[] | null
          id: string
          results_count: number | null
          search_duration_ms: number | null
          search_query: string
          user_id: string | null
        }
        Insert: {
          clicked_result_id?: string | null
          clicked_result_type?: string | null
          created_at?: string
          entity_types?: string[] | null
          id?: string
          results_count?: number | null
          search_duration_ms?: number | null
          search_query: string
          user_id?: string | null
        }
        Update: {
          clicked_result_id?: string | null
          clicked_result_type?: string | null
          created_at?: string
          entity_types?: string[] | null
          id?: string
          results_count?: number | null
          search_duration_ms?: number | null
          search_query?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          features: Json | null
          id: string
          max_users: number | null
          organization_id: string | null
          plan_id: string
          plan_name: string
          price_monthly: number | null
          price_yearly: number | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          features?: Json | null
          id?: string
          max_users?: number | null
          organization_id?: string | null
          plan_id: string
          plan_name: string
          price_monthly?: number | null
          price_yearly?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          features?: Json | null
          id?: string
          max_users?: number | null
          organization_id?: string | null
          plan_id?: string
          plan_name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      template_checklist_items: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_index: number
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_index?: number
          template_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_index?: number
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_checklist_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "work_order_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      time_logs: {
        Row: {
          duration_minutes: number
          id: string
          logged_at: string
          note: string | null
          user_id: string
          work_order_id: string
        }
        Insert: {
          duration_minutes: number
          id?: string
          logged_at?: string
          note?: string | null
          user_id: string
          work_order_id: string
        }
        Update: {
          duration_minutes?: number
          id?: string
          logged_at?: string
          note?: string | null
          user_id?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          work_order_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
          work_order_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_comments_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_parts_used: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string | null
          notes: string | null
          quantity: number
          tenant_id: string | null
          work_order_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string | null
          notes?: string | null
          quantity: number
          tenant_id?: string | null
          work_order_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string | null
          notes?: string | null
          quantity?: number
          tenant_id?: string | null
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_order_parts_used_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_parts_used_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_parts_used_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_procedures: {
        Row: {
          created_at: string | null
          id: string
          procedure_id: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
          work_order_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          procedure_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          work_order_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          procedure_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_order_procedures_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_procedures_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_procedures_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_templates: {
        Row: {
          created_at: string
          default_assignee: string | null
          default_tags: string[] | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["priority_level"]
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_assignee?: string | null
          default_tags?: string[] | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_assignee?: string | null
          default_tags?: string[] | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_templates_default_assignee_fkey"
            columns: ["default_assignee"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_templates_default_assignee_fkey"
            columns: ["default_assignee"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          asset_id: string | null
          assigned_to: string | null
          category: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          location_id: string | null
          parts_used: Json | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          recurrence_rules: Json | null
          requester_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["work_order_status"]
          tags: string[] | null
          template_id: string | null
          tenant_id: string
          time_spent: number | null
          title: string
          total_cost: number | null
          updated_at: string | null
        }
        Insert: {
          asset_id?: string | null
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          location_id?: string | null
          parts_used?: Json | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          recurrence_rules?: Json | null
          requester_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["work_order_status"]
          tags?: string[] | null
          template_id?: string | null
          tenant_id: string
          time_spent?: number | null
          title: string
          total_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          asset_id?: string | null
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          location_id?: string | null
          parts_used?: Json | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          recurrence_rules?: Json | null
          requester_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["work_order_status"]
          tags?: string[] | null
          template_id?: string | null
          tenant_id?: string
          time_spent?: number | null
          title?: string
          total_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users_with_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "work_order_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      users_with_role: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          status: string | null
          system_role: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_invitation: {
        Args: { token_param: string; user_id_param: string }
        Returns: boolean
      }
      assign_system_role: {
        Args: {
          target_user_id: string
          new_role: Database["public"]["Enums"]["app_role"]
          assigned_by_user_id?: string
        }
        Returns: undefined
      }
      copy_asset_procedures_to_work_order: {
        Args: { asset_id_param: string; work_order_id_param: string }
        Returns: undefined
      }
      current_user_is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      decrement_inventory_and_log: {
        Args: {
          inv_item_id: string
          qty_used: number
          wo_id: string
          usage_notes?: string
        }
        Returns: undefined
      }
      delete_notifications: {
        Args: { p_user_id: string; p_notification_ids: string[] }
        Returns: undefined
      }
      enum_values: {
        Args: { enum_name: string }
        Returns: string[]
      }
      get_asset_documents: {
        Args: { asset_id_param: string }
        Returns: {
          id: string
          file_name: string
          file_size: number
          file_type: string
          download_url: string
          created_at: string
        }[]
      }
      get_current_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_documentation_gaps: {
        Args: { org_id: string }
        Returns: {
          id: string
          title: string
          gap_reason: string
        }[]
      }
      get_documentation_performance: {
        Args: { org_id: string }
        Returns: {
          id: string
          title: string
          views: number
        }[]
      }
      get_invitation_by_token: {
        Args: { token_param: string }
        Returns: {
          id: string
          organization_id: string
          invited_email: string
          role: Database["public"]["Enums"]["organization_role"]
          invitation_expires_at: string
          organization_name: string
        }[]
      }
      get_required_approvals: {
        Args: { po_id: string; po_amount: number }
        Returns: {
          rule_id: string
          required_role: string
          min_amount: number
          max_amount: number
        }[]
      }
      get_trending_documents: {
        Args:
          | { org_id: string }
          | { p_organization_id: string; p_limit?: number }
        Returns: {
          id: string
          title: string
          content: string
          category_id: string
          organization_id: string
          created_at: string
          updated_at: string
          views: number
        }[]
      }
      get_user_system_role: {
        Args: { user_id_param?: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      global_search: {
        Args: { search_query: string; entity_types?: string[] }
        Returns: {
          entity_type: string
          entity_id: string
          title: string
          subtitle: string
          url: string
          relevance: number
          created_at: string
        }[]
      }
      increment_inventory_from_po: {
        Args: { po_id: string }
        Returns: undefined
      }
      is_purchase_order_approved: {
        Args: { po_id: string }
        Returns: boolean
      }
      log_search_analytics: {
        Args: {
          search_query_param: string
          entity_types_param?: string[]
          results_count_param?: number
          search_duration_ms_param?: number
        }
        Returns: string
      }
      log_search_click: {
        Args: {
          analytics_id_param: string
          clicked_result_id_param: string
          clicked_result_type_param: string
        }
        Returns: undefined
      }
      mark_all_notifications_as_read: {
        Args: { p_user_id: string }
        Returns: {
          category: string
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          organization_id: string | null
          read_at: string | null
          severity: string
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }[]
      }
      mark_notifications_as_read: {
        Args: { p_user_id: string; p_notification_ids: string[] }
        Returns: {
          category: string
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          organization_id: string | null
          read_at: string | null
          severity: string
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }[]
      }
      record_parts_usage: {
        Args: {
          wo_id: string
          item_id: string
          qty: number
          usage_notes?: string
        }
        Returns: undefined
      }
      search_documentation: {
        Args: { search_query: string }
        Returns: {
          id: string
          title: string
          category: string
          slug: string
          access_level: string
          created_at: string
          relevance: number
        }[]
      }
      search_organizations: {
        Args: { search_query: string }
        Returns: {
          id: string
          name: string
          contact_email: string
          created_at: string
          member_count: number
          relevance: number
        }[]
      }
      search_subscriptions: {
        Args: { search_query: string }
        Returns: {
          id: string
          plan_name: string
          status: string
          billing_cycle: string
          created_at: string
          price_monthly: number
          relevance: number
        }[]
      }
      search_users: {
        Args: { search_query: string }
        Returns: {
          id: string
          email: string
          tenant_id: string
          created_at: string
          organization_count: number
          relevance: number
        }[]
      }
      update_user_info: {
        Args: {
          user_id_param: string
          first_name_param?: string
          last_name_param?: string
          avatar_url_param?: string
        }
        Returns: undefined
      }
      update_user_status: {
        Args: { user_id_param: string; status_param: string }
        Returns: undefined
      }
      user_can_manage_organization_members: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      user_can_update_organization: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      user_has_tenant_access: {
        Args: { tenant_uuid: string }
        Returns: boolean
      }
      user_is_org_admin: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
      user_is_organization_member: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      user_is_organization_member_secure: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "organization_admin" | "user"
      asset_status: "active" | "maintenance" | "out_of_service" | "retired"
      color_token:
        | "primary"
        | "secondary"
        | "accent"
        | "background"
        | "surface"
        | "error"
        | "success"
        | "warning"
        | "info"
      font_size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
      organization_role:
        | "owner"
        | "admin"
        | "operations_manager"
        | "maintenance_manager"
        | "engineer"
        | "technician"
        | "requester"
        | "client"
        | "viewer"
      priority_level: "low" | "medium" | "high" | "urgent"
      purchase_order_status:
        | "draft"
        | "pending"
        | "approved"
        | "ordered"
        | "received"
        | "cancelled"
        | "pending_approval"
        | "rejected"
      request_priority: "low" | "medium" | "high" | "urgent"
      request_status:
        | "pending"
        | "approved"
        | "rejected"
        | "in_progress"
        | "completed"
        | "cancelled"
      work_order_status:
        | "open"
        | "in_progress"
        | "on_hold"
        | "completed"
        | "cancelled"
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
      app_role: ["super_admin", "organization_admin", "user"],
      asset_status: ["active", "maintenance", "out_of_service", "retired"],
      color_token: [
        "primary",
        "secondary",
        "accent",
        "background",
        "surface",
        "error",
        "success",
        "warning",
        "info",
      ],
      font_size: ["xs", "sm", "md", "lg", "xl", "2xl"],
      organization_role: [
        "owner",
        "admin",
        "operations_manager",
        "maintenance_manager",
        "engineer",
        "technician",
        "requester",
        "client",
        "viewer",
      ],
      priority_level: ["low", "medium", "high", "urgent"],
      purchase_order_status: [
        "draft",
        "pending",
        "approved",
        "ordered",
        "received",
        "cancelled",
        "pending_approval",
        "rejected",
      ],
      request_priority: ["low", "medium", "high", "urgent"],
      request_status: [
        "pending",
        "approved",
        "rejected",
        "in_progress",
        "completed",
        "cancelled",
      ],
      work_order_status: [
        "open",
        "in_progress",
        "on_hold",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
