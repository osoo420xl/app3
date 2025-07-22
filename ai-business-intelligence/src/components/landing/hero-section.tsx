'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Zap, Users, ArrowRight, Sparkles } from 'lucide-react'
import { useMounted } from '@/hooks/use-mounted'
import { Loading } from '@/components/ui/loading'

export function HeroSection() {
  const [ideasDiscovered, setIdeasDiscovered] = useState(1247)
  const [usersCount, setUsersCount] = useState(3429)
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return
    
    // Simulate real-time counters
    const ideasInterval = setInterval(() => {
      setIdeasDiscovered(prev => prev + Math.floor(Math.random() * 3))
    }, 8000)

    const usersInterval = setInterval(() => {
      setUsersCount(prev => prev + Math.floor(Math.random() * 2))
    }, 12000)

    return () => {
      clearInterval(ideasInterval)
      clearInterval(usersInterval)
    }
  }, [mounted])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loading message="Initializing AI Business Intelligence..." size="lg" />
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                {ideasDiscovered.toLocaleString()} ideas discovered today
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white/90 text-sm font-medium">
                {usersCount.toLocaleString()} entrepreneurs online
              </span>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Million-Dollar
                </span>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </span>
              {' '}AI Business Ideas
            </motion.h1>
            
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl text-white/80 font-medium max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Before Your Competitors Do
            </motion.h2>
          </div>

          <motion.p 
            className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Our AI scouts 10,000+ data sources daily to surface untapped opportunities 
            in the $394B AI market. Get strategic insights that would cost $50K from McKinsey.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
              onClick={() => window.location.href = '/dashboard'}
            >
              Get Your First 5 Ideas Free
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full backdrop-blur-sm"
            >
              Watch Demo
              <Zap className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-6 pt-12 opacity-70"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="text-white/60 text-sm">Trusted by entrepreneurs from:</div>
            <div className="flex items-center gap-6">
              <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-white font-semibold">Google</span>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-white font-semibold">Meta</span>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-white font-semibold">Y Combinator</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
