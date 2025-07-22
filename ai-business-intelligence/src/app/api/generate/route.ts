import { NextRequest, NextResponse } from 'next/server'
import { llmLoadBalancer } from '@/lib/llm/providers'

export async function POST(request: NextRequest) {
  try {
    const { industry, constraints } = await request.json()

    const result = await llmLoadBalancer.generateBusinessIdeas(industry, constraints)
    
    // Parse the LLM response to extract structured data
    const ideas = parseBusinessIdeasFromResponse(result.content)
    
    return NextResponse.json({
      success: true,
      ideas,
      metadata: {
        provider: result.provider,
        model: result.model,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error generating business ideas:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

function parseBusinessIdeasFromResponse(content: string) {
  // This is a simplified parser - in production, you'd want more robust parsing
  const ideas = []
  const sections = content.split(/(?=\*\*Idea Name\*\*:|## |\d+\.)/)
  
  for (const section of sections) {
    if (section.trim() && section.includes('Idea Name')) {
      const idea = {
        title: extractField(section, 'Idea Name') || extractField(section, 'Title'),
        description: extractField(section, 'One-Liner') || extractField(section, 'Description'),
        market_opportunity: extractField(section, 'Market Opportunity'),
        target_customer: extractField(section, 'Target Customer'),
        revenue_model: extractField(section, 'Revenue Model'),
        competitive_advantage: extractField(section, 'Competitive Advantage'),
        implementation_roadmap: extractField(section, 'Implementation Roadmap'),
        risk_assessment: extractField(section, 'Risk Assessment'),
        success_metrics: extractField(section, 'Success Metrics'),
        feasibility_score: calculateFeasibilityScore(section),
        market_timing: extractField(section, 'Market Timing') || 'Just right',
        resource_requirements: extractField(section, 'Resource Requirements') || 'Small team, 3-6 months',
        success_probability: calculateSuccessProbability(section),
        tags: extractTags(section),
        status: 'discovered' as const,
        source: 'AI Generated',
        confidence_score: Math.floor(Math.random() * 30) + 70 // 70-100
      }
      
      if (idea.title && idea.description) {
        ideas.push(idea)
      }
    }
  }
  
  return ideas.slice(0, 5) // Limit to 5 ideas
}

function extractField(text: string, fieldName: string): string {
  const patterns = [
    new RegExp(`\\*\\*${fieldName}\\*\\*:?\\s*([^\\*\\n]+)`, 'i'),
    new RegExp(`${fieldName}:?\\s*([^\\n]+)`, 'i'),
    new RegExp(`## ${fieldName}\\s*([^#\\n]+)`, 'i')
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return ''
}

function extractTags(text: string): string[] {
  const tags = []
  const lowercaseText = text.toLowerCase()
  
  // AI/Tech tags
  if (lowercaseText.includes('ai') || lowercaseText.includes('artificial intelligence')) tags.push('AI')
  if (lowercaseText.includes('machine learning') || lowercaseText.includes('ml')) tags.push('Machine Learning')
  if (lowercaseText.includes('saas') || lowercaseText.includes('software as a service')) tags.push('SaaS')
  if (lowercaseText.includes('automation')) tags.push('Automation')
  if (lowercaseText.includes('data') || lowercaseText.includes('analytics')) tags.push('Data Analytics')
  
  // Market tags
  if (lowercaseText.includes('b2b')) tags.push('B2B')
  if (lowercaseText.includes('b2c')) tags.push('B2C')
  if (lowercaseText.includes('enterprise')) tags.push('Enterprise')
  if (lowercaseText.includes('startup')) tags.push('Startup')
  
  // Industry tags
  if (lowercaseText.includes('healthcare') || lowercaseText.includes('medical')) tags.push('Healthcare')
  if (lowercaseText.includes('finance') || lowercaseText.includes('fintech')) tags.push('Fintech')
  if (lowercaseText.includes('education') || lowercaseText.includes('edtech')) tags.push('Education')
  if (lowercaseText.includes('marketing')) tags.push('Marketing')
  if (lowercaseText.includes('ecommerce') || lowercaseText.includes('e-commerce')) tags.push('E-commerce')
  
  return tags.slice(0, 5) // Limit to 5 tags
}

function calculateFeasibilityScore(text: string): number {
  let score = 70 // Base score
  
  const lowercaseText = text.toLowerCase()
  
  // Positive indicators
  if (lowercaseText.includes('simple') || lowercaseText.includes('easy')) score += 10
  if (lowercaseText.includes('existing technology') || lowercaseText.includes('proven')) score += 8
  if (lowercaseText.includes('small team')) score += 5
  if (lowercaseText.includes('quick') || lowercaseText.includes('fast')) score += 5
  
  // Negative indicators
  if (lowercaseText.includes('complex') || lowercaseText.includes('complicated')) score -= 10
  if (lowercaseText.includes('regulatory') || lowercaseText.includes('compliance')) score -= 8
  if (lowercaseText.includes('large team') || lowercaseText.includes('significant resources')) score -= 10
  if (lowercaseText.includes('uncertain') || lowercaseText.includes('risky')) score -= 5
  
  return Math.max(10, Math.min(100, score))
}

function calculateSuccessProbability(text: string): number {
  let probability = 60 // Base probability
  
  const lowercaseText = text.toLowerCase()
  
  // Market factors
  if (lowercaseText.includes('growing market') || lowercaseText.includes('increasing demand')) probability += 15
  if (lowercaseText.includes('proven demand') || lowercaseText.includes('validated')) probability += 10
  if (lowercaseText.includes('early stage') || lowercaseText.includes('emerging')) probability += 8
  
  // Competition factors
  if (lowercaseText.includes('low competition') || lowercaseText.includes('blue ocean')) probability += 12
  if (lowercaseText.includes('first mover') || lowercaseText.includes('unique')) probability += 10
  if (lowercaseText.includes('highly competitive') || lowercaseText.includes('saturated')) probability -= 15
  
  // Risk factors
  if (lowercaseText.includes('high risk') || lowercaseText.includes('uncertain')) probability -= 10
  if (lowercaseText.includes('regulatory risk') || lowercaseText.includes('compliance issues')) probability -= 8
  
  return Math.max(20, Math.min(95, probability))
}
