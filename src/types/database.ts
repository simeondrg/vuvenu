/**
 * Types TypeScript générés pour la base de données VuVenu
 *
 * ⚠️ IMPORTANT: Ce fichier sera remplacé par la version générée automatiquement
 * avec la commande: npx supabase gen types typescript --project-id <id>
 *
 * Version manuelle temporaire basée sur notre schéma 001_initial_schema.sql
 */

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
      profiles: {
        Row: {
          id: string
          business_name: string
          business_type: string
          target_audience: string | null
          main_goal: string | null
          stripe_customer_id: string | null
          subscription_status: 'none' | 'active' | 'past_due' | 'canceled'
          subscription_tier: 'starter' | 'pro' | 'business' | null
          billing_period: 'monthly' | 'yearly' | null
          scripts_count_month: number
          campaigns_count_month: number
          counts_reset_at: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          business_name: string
          business_type: string
          target_audience?: string | null
          main_goal?: string | null
          stripe_customer_id?: string | null
          subscription_status?: 'none' | 'active' | 'past_due' | 'canceled'
          subscription_tier?: 'starter' | 'pro' | 'business' | null
          billing_period?: 'monthly' | 'yearly' | null
          scripts_count_month?: number
          campaigns_count_month?: number
          counts_reset_at?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          business_type?: string
          target_audience?: string | null
          main_goal?: string | null
          stripe_customer_id?: string | null
          subscription_status?: 'none' | 'active' | 'past_due' | 'canceled'
          subscription_tier?: 'starter' | 'pro' | 'business' | null
          billing_period?: 'monthly' | 'yearly' | null
          scripts_count_month?: number
          campaigns_count_month?: number
          counts_reset_at?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      scripts: {
        Row: {
          id: string
          user_id: string
          title: string
          input_data: Json
          content: string
          format: string
          tone: string
          tokens_used: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          input_data: Json
          content: string
          format: string
          tone: string
          tokens_used?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          input_data?: Json
          content?: string
          format?: string
          tone?: string
          tokens_used?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'scripts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          title: string
          input_data: Json
          status: 'draft' | 'generating' | 'ready' | 'launched' | 'paused' | 'completed'
          wizard_step: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          input_data: Json
          status?: 'draft' | 'generating' | 'ready' | 'launched' | 'paused' | 'completed'
          wizard_step?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          input_data?: Json
          status?: 'draft' | 'generating' | 'ready' | 'launched' | 'paused' | 'completed'
          wizard_step?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'campaigns_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      campaign_concepts: {
        Row: {
          id: string
          campaign_id: string
          funnel_stage: 'top' | 'middle' | 'bottom'
          name: string
          angle: string | null
          ad_type: string | null
          primary_text: string
          headline: string
          description: string | null
          image_url: string | null
          image_prompt: string | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          funnel_stage: 'top' | 'middle' | 'bottom'
          name: string
          angle?: string | null
          ad_type?: string | null
          primary_text: string
          headline: string
          description?: string | null
          image_url?: string | null
          image_prompt?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          funnel_stage?: 'top' | 'middle' | 'bottom'
          name?: string
          angle?: string | null
          ad_type?: string | null
          primary_text?: string
          headline?: string
          description?: string | null
          image_url?: string | null
          image_prompt?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'campaign_concepts_campaign_id_fkey'
            columns: ['campaign_id']
            isOneToOne: false
            referencedRelation: 'campaigns'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      user_dashboard: {
        Row: {
          id: string
          business_name: string
          subscription_tier: 'starter' | 'pro' | 'business' | null
          subscription_status: 'none' | 'active' | 'past_due' | 'canceled'
          scripts_count_month: number
          campaigns_count_month: number
          scripts_limit_month: number
          campaigns_limit_month: number
          total_scripts: number
          total_campaigns: number
          created_at: string
          onboarding_completed: boolean
        }
        Relationships: []
      }
    }
    Functions: {
      reset_monthly_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_usage: {
        Args: {
          user_id: string
          column_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      subscription_status: 'none' | 'active' | 'past_due' | 'canceled'
      subscription_tier: 'starter' | 'pro' | 'business'
      campaign_status: 'draft' | 'generating' | 'ready' | 'launched' | 'paused' | 'completed'
      funnel_stage: 'top' | 'middle' | 'bottom'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Types d'export pour faciliter l'usage
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never