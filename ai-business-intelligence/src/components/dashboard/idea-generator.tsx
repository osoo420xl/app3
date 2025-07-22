'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Lightbulb, Zap, TrendingUp, Target, DollarSign, Shield, Rocket, AlertTriangle } from 'lucide-react'
import { useIdeaStore } from '@/stores/idea-store'

interface GeneratedIdea {
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
  tags: string[]
  status: 'discovered'
  source: string
  confidence_score: number
}

export function IdeaGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([])
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const { addIdea } = useIdeaStore()

  const industries = [
    'Healthcare', 'Fintech', 'Education', 'E-commerce', 'Marketing', 
    'HR Tech', 'PropTech', 'LegalTech', 'AgriTech', 'CleanTech'
  ]

  const generateIdeas = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: selectedIndustry,
          constraints: {
            budget: 50000,
            timeframe: 6,
            teamSize: 3
          }
        }),
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedIdeas(data.ideas)
      } else {
        console.error('Failed to generate ideas:', data.error)
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveIdea = async (idea: GeneratedIdea) => {
    try {
      await addIdea({
        ...idea,
        user_id: 'demo-user' // In production, use actual user ID
      })
    } catch (error) {
      console.error('Error saving idea:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Business Idea Generator
          </CardTitle>
          <CardDescription>
            Discover million-dollar opportunities before your competitors do
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Industry (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedIndustry(selectedIndustry === industry ? '' : industry)}
                  className="text-xs"
                >
                  {industry}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={generateIdeas}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Zap className="h-4 w-4" />
              </motion.div>
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Generating Ideas...' : 'Generate Business Ideas'}
          </Button>
        </CardContent>
      </Card>

      {generatedIdeas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Generated Ideas</h3>
          {generatedIdeas.map((idea, index) => (
            <IdeaCard key={index} idea={idea} onSave={() => saveIdea(idea)} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

function IdeaCard({ idea, onSave }: { idea: GeneratedIdea; onSave: () => void }) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave()
    setSaved(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{idea.title}</CardTitle>
              <CardDescription className="text-base">{idea.description}</CardDescription>
              <div className="flex flex-wrap gap-1">
                {idea.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saved}
              variant={saved ? "secondary" : "default"}
              size="sm"
            >
              {saved ? 'Saved!' : 'Save Idea'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Market Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.market_opportunity}</p>
              
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Target Customer</span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.target_customer}</p>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Revenue Model</span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.revenue_model}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Competitive Advantage</span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.competitive_advantage}</p>
              
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Implementation</span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.implementation_roadmap}</p>
              
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium">Risk Assessment</span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.risk_assessment}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm font-medium mb-1">Feasibility Score</div>
              <div className="flex items-center gap-2">
                <Progress value={idea.feasibility_score} className="flex-1" />
                <span className="text-sm font-medium">{idea.feasibility_score}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Success Probability</div>
              <div className="flex items-center gap-2">
                <Progress value={idea.success_probability} className="flex-1" />
                <span className="text-sm font-medium">{idea.success_probability}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Confidence Score</div>
              <div className="flex items-center gap-2">
                <Progress value={idea.confidence_score} className="flex-1" />
                <span className="text-sm font-medium">{idea.confidence_score}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
