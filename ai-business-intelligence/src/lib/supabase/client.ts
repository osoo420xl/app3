import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      business_ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          market_opportunity: string
          target_customer: string
          revenue_model: string
          competitive_advantage: string
          implementation_roadmap: string
          risk_assessment: string
          success_metrics: string
          feasibility_score: number
          market_timing: string
          resource_requirements: string
          success_probability: number
          created_at: string
          updated_at: string
          tags: string[]
          status: 'discovered' | 'validating' | 'developing' | 'launched'
          source: string
          confidence_score: number
        }
        Insert: Omit<Database['public']['Tables']['business_ideas']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['business_ideas']['Insert']>
      }
      competitors: {
        Row: {
          id: string
          business_idea_id: string
          name: string
          description: string
          business_model: string
          strengths: string[]
          weaknesses: string[]
          market_position: string
          threat_level: 'low' | 'medium' | 'high'
          opportunities: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['competitors']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['competitors']['Insert']>
      }
      trends: {
        Row: {
          id: string
          title: string
          description: string
          source: string
          trend_score: number
          category: string
          discovered_at: string
          metadata: Record<string, unknown>
        }
        Insert: Omit<Database['public']['Tables']['trends']['Row'], 'id' | 'discovered_at'>
        Update: Partial<Database['public']['Tables']['trends']['Insert']>
      }
    }
  }
}
