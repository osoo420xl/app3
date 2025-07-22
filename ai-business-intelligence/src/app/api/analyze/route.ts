import { NextRequest, NextResponse } from 'next/server'
import { llmLoadBalancer } from '@/lib/llm/providers'

export async function POST(request: NextRequest) {
  try {
    const { companyName, businessIdea } = await request.json()

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      )
    }

    const result = await llmLoadBalancer.analyzeCompetitor(companyName, businessIdea)
    
    // Parse the competitor analysis response
    const analysis = parseCompetitorAnalysis(result.content, companyName)
    
    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        provider: result.provider,
        model: result.model,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error analyzing competitor:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

function parseCompetitorAnalysis(content: string, companyName: string) {
  const analysis = {
    name: companyName,
    description: extractField(content, 'Company Overview') || extractField(content, 'Description') || 'AI-powered competitor analysis',
    business_model: extractField(content, 'Business Model') || extractField(content, 'Revenue Model'),
    strengths: extractListField(content, 'Strengths') || extractListField(content, 'Advantages'),
    weaknesses: extractListField(content, 'Weaknesses') || extractListField(content, 'Vulnerabilities'),
    market_position: extractField(content, 'Market Position') || extractField(content, 'Brand Positioning'),
    threat_level: calculateThreatLevel(content) as 'low' | 'medium' | 'high',
    opportunities: extractListField(content, 'Opportunities') || extractListField(content, 'Gaps')
  }
  
  return analysis
}

function extractField(text: string, fieldName: string): string {
  const patterns = [
    new RegExp(`\\*\\*${fieldName}\\*\\*:?\\s*([^\\*\\n]+(?:\\n(?!\\*\\*)[^\\n]*)*?)(?=\\n\\*\\*|$)`, 'i'),
    new RegExp(`${fieldName}:?\\s*([^\\n]+(?:\\n(?!\\w+:)[^\\n]*)*?)(?=\\n\\w+:|$)`, 'i'),
    new RegExp(`## ${fieldName}\\s*([^#]+?)(?=\\n##|$)`, 'i'),
    new RegExp(`\\d+\\.\\s*\\*\\*${fieldName}\\*\\*\\s*([^\\n]+(?:\\n(?!\\d+\\.|\\*\\*)[^\\n]*)*?)(?=\\n\\d+\\.|\\n\\*\\*|$)`, 'i')
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ')
    }
  }
  
  return ''
}

function extractListField(text: string, fieldName: string): string[] {
  const fieldContent = extractField(text, fieldName)
  if (!fieldContent) return []
  
  // Split by bullet points, dashes, or numbers
  const items = fieldContent
    .split(/[-•*\d+\.\)]\s*/)
    .map(item => item.trim())
    .filter(item => item.length > 5) // Filter out very short items
    .slice(0, 5) // Limit to 5 items
  
  return items
}

function calculateThreatLevel(text: string): string {
  const lowercaseText = text.toLowerCase()
  let score = 0
  
  // High threat indicators
  if (lowercaseText.includes('market leader') || lowercaseText.includes('dominant')) score += 3
  if (lowercaseText.includes('well-funded') || lowercaseText.includes('large budget')) score += 2
  if (lowercaseText.includes('strong brand') || lowercaseText.includes('established')) score += 2
  if (lowercaseText.includes('competitive advantage') || lowercaseText.includes('moat')) score += 2
  
  // Medium threat indicators
  if (lowercaseText.includes('growing') || lowercaseText.includes('expanding')) score += 1
  if (lowercaseText.includes('innovative') || lowercaseText.includes('advanced')) score += 1
  if (lowercaseText.includes('experienced team') || lowercaseText.includes('expertise')) score += 1
  
  // Low threat indicators (negative score)
  if (lowercaseText.includes('vulnerable') || lowercaseText.includes('weakness')) score -= 2
  if (lowercaseText.includes('outdated') || lowercaseText.includes('legacy')) score -= 1
  if (lowercaseText.includes('struggling') || lowercaseText.includes('declining')) score -= 2
  if (lowercaseText.includes('limited resources') || lowercaseText.includes('small team')) score -= 1
  
  if (score >= 4) return 'high'
  if (score >= 1) return 'medium'
  return 'low'
}
