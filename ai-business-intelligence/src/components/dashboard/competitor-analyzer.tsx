'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Shield, TrendingDown, TrendingUp, Target, AlertTriangle } from 'lucide-react'

interface CompetitorAnalysis {
  name: string
  description: string
  business_model: string
  strengths: string[]
  weaknesses: string[]
  market_position: string
  threat_level: 'low' | 'medium' | 'high'
  opportunities: string[]
}

export function CompetitorAnalyzer() {
  const [companyName, setCompanyName] = useState('')
  const [businessIdea, setBusinessIdea] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null)

  const analyzeCompetitor = async () => {
    if (!companyName.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          businessIdea: businessIdea.trim() || undefined
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        console.error('Failed to analyze competitor:', data.error)
      }
    } catch (error) {
      console.error('Error analyzing competitor:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-500 bg-green-50 border-green-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <TrendingUp className="h-4 w-4" />
      case 'low': return <Shield className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-orange-500" />
            Competitor Intelligence Engine
          </CardTitle>
          <CardDescription>
            Get McKinsey-level competitive analysis in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Slack, Notion, Figma"
                className="w-full px-3 py-2 border border-white/20 bg-white/5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Business Idea (Optional)</label>
              <input
                type="text"
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder="e.g., AI-powered project management"
                className="w-full px-3 py-2 border border-white/20 bg-white/5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-white placeholder:text-white/50"
              />
            </div>
          </div>
          
          <Button
            onClick={analyzeCompetitor}
            disabled={isAnalyzing || !companyName.trim()}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            size="lg"
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Search className="h-4 w-4" />
              </motion.div>
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing Competitor...' : 'Analyze Competitor'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{analysis.name}</CardTitle>
                  <CardDescription>{analysis.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getThreatLevelColor(analysis.threat_level)} flex items-center gap-1`}>
                      {getThreatIcon(analysis.threat_level)}
                      {analysis.threat_level.toUpperCase()} THREAT
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Business Model
                </h4>
                <p className="text-sm text-muted-foreground">{analysis.business_model}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  Market Position
                </h4>
                <p className="text-sm text-muted-foreground">{analysis.market_position}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Strengths
                  </h4>
                  <div className="space-y-2">
                    {analysis.strengths.length > 0 ? (
                      analysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{strength}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No specific strengths identified</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    Weaknesses
                  </h4>
                  <div className="space-y-2">
                    {analysis.weaknesses.length > 0 ? (
                      analysis.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{weakness}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No specific weaknesses identified</p>
                    )}
                  </div>
                </div>
              </div>
              
              {analysis.opportunities.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-yellow-500" />
                    Opportunities to Exploit
                  </h4>
                  <div className="space-y-2">
                    {analysis.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
