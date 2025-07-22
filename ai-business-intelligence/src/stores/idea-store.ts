import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'

export interface BusinessIdea {
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

export interface Competitor {
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

interface IdeaStore {
  ideas: BusinessIdea[]
  competitors: Competitor[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchIdeas: () => Promise<void>
  addIdea: (idea: Omit<BusinessIdea, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateIdea: (id: string, updates: Partial<BusinessIdea>) => Promise<void>
  deleteIdea: (id: string) => Promise<void>
  fetchCompetitors: (ideaId: string) => Promise<void>
  addCompetitor: (competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useIdeaStore = create<IdeaStore>((set) => ({
  ideas: [],
  competitors: [],
  loading: false,
  error: null,

  fetchIdeas: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('business_ideas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ ideas: data || [], loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  addIdea: async (idea) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('business_ideas')
        .insert([idea])
        .select()
        .single()

      if (error) throw error
      set(state => ({ 
        ideas: [data, ...state.ideas], 
        loading: false 
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  updateIdea: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('business_ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      set(state => ({
        ideas: state.ideas.map(idea => 
          idea.id === id ? { ...idea, ...data } : idea
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  deleteIdea: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('business_ideas')
        .delete()
        .eq('id', id)

      if (error) throw error
      set(state => ({
        ideas: state.ideas.filter(idea => idea.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  fetchCompetitors: async (ideaId) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .eq('business_idea_id', ideaId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ competitors: data || [], loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  addCompetitor: async (competitor) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('competitors')
        .insert([competitor])
        .select()
        .single()

      if (error) throw error
      set(state => ({ 
        competitors: [data, ...state.competitors], 
        loading: false 
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}))
