'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IdeaGenerator } from '@/components/dashboard/idea-generator'
import { CompetitorAnalyzer } from '@/components/dashboard/competitor-analyzer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Search, TrendingUp, Target, Users, Zap, BarChart3, Settings } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('generate')

  const tabs = [
    { id: 'generate', label: 'Generate Ideas', icon: Lightbulb, color: 'from-blue-600 to-purple-600' },
    { id: 'analyze', label: 'Analyze Competitors', icon: Search, color: 'from-orange-600 to-red-600' },
    { id: 'insights', label: 'Market Insights', icon: TrendingUp, color: 'from-green-600 to-blue-600' },
    { id: 'saved', label: 'Saved Ideas', icon: Target, color: 'from-purple-600 to-pink-600' }
  ]

  const stats = [
    { label: 'Ideas Generated', value: '1,247', change: '+23%', icon: Lightbulb, color: 'text-blue-500' },
    { label: 'Competitors Analyzed', value: '89', change: '+12%', icon: Search, color: 'text-orange-500' },
    { label: 'Market Opportunities', value: '34', change: '+45%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Active Users', value: '3,429', change: '+18%', icon: Users, color: 'text-purple-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">AI Business Intelligence</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                        <span className="text-sm text-green-400 font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-white/10`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white`
                  : 'border-white/20 text-white hover:bg-white/10'
              } transition-all duration-300`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'generate' && <IdeaGenerator />}
          {activeTab === 'analyze' && <CompetitorAnalyzer />}
          {activeTab === 'insights' && <MarketInsights />}
          {activeTab === 'saved' && <SavedIdeas />}
        </motion.div>
      </div>
    </div>
  )
}

function MarketInsights() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Market Intelligence Dashboard
          </CardTitle>
          <CardDescription>
            Real-time market trends and opportunity analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Trending Markets</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <div className="font-medium">AI Healthcare</div>
                    <div className="text-sm text-white/60">+127% growth</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Hot</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <div className="font-medium">Fintech AI</div>
                    <div className="text-sm text-white/60">+89% growth</div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400">Rising</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <div className="font-medium">EdTech Platforms</div>
                    <div className="text-sm text-white/60">+64% growth</div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">Stable</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Opportunity Signals</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="font-medium mb-1">Low Competition Alert</div>
                  <div className="text-sm text-white/60">AI-powered legal document analysis has 73% fewer competitors than average</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="font-medium mb-1">Market Gap Detected</div>
                  <div className="text-sm text-white/60">Small business AI automation tools are underserved with $2.3B TAM</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="font-medium mb-1">Funding Trend</div>
                  <div className="text-sm text-white/60">AI infrastructure startups raised 340% more funding this quarter</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SavedIdeas() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Your Saved Ideas
          </CardTitle>
          <CardDescription>
            Manage and track your business idea pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/70 mb-2">No saved ideas yet</h3>
            <p className="text-white/50 mb-6">Start generating ideas to build your opportunity pipeline</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Lightbulb className="w-4 h-4 mr-2" />
              Generate Your First Idea
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
