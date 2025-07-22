export interface LLMProvider {
  name: string;
  apiKey: string;
  model: string;
  endpoint: string;
  requestsPerMinute: number;
  requestsUsed: number;
  lastReset: number;
}

export const LLM_PROVIDERS: Record<string, LLMProvider> = {
  openrouter: {
    name: 'OpenRouter',
    apiKey: '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',
    model: 'google/gemini-2.0-flash-exp',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    requestsPerMinute: 10,
    requestsUsed: 0,
    lastReset: Date.now()
  },
  together: {
    name: 'Together AI',
    apiKey: '7bb56669f2604ae72e892b17e11278d699f0744a5324f2fff31cfe80107dd152',
    model: 'meta-llama/Llama-3.1-8B-Instruct-Turbo',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    requestsPerMinute: 60,
    requestsUsed: 0,
    lastReset: Date.now()
  },
  groq: {
    name: 'Groq',
    apiKey: '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',
    model: 'llama-3.1-8b-instant',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    requestsPerMinute: 30,
    requestsUsed: 0,
    lastReset: Date.now()
  },
  huggingface: {
    name: 'Hugging Face',
    apiKey: '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',
    model: 'microsoft/DialoGPT-medium',
    endpoint: 'https://api-inference.huggingface.co/models',
    requestsPerMinute: 100,
    requestsUsed: 0,
    lastReset: Date.now()
  }
};

export class LLMLoadBalancer {
  private providers = LLM_PROVIDERS;

  private resetRateLimit(provider: LLMProvider): void {
    const now = Date.now();
    const minutesPassed = (now - provider.lastReset) / (1000 * 60);
    
    if (minutesPassed >= 1) {
      provider.requestsUsed = 0;
      provider.lastReset = now;
    }
  }

  private getAvailableProvider(): LLMProvider | null {
    const providersList = Object.values(this.providers);
    
    // Reset rate limits for all providers
    providersList.forEach(provider => this.resetRateLimit(provider));
    
    // Find provider with available capacity
    const availableProvider = providersList.find(
      provider => provider.requestsUsed < provider.requestsPerMinute
    );
    
    return availableProvider || null;
  }

  async makeRequest(messages: Array<{role: string; content: string}>, options: Record<string, unknown> = {}): Promise<{content: string; provider: string; model: string}> {
    const provider = this.getAvailableProvider();
    
    if (!provider) {
      throw new Error('All LLM providers are rate limited. Please try again later.');
    }

    try {
      provider.requestsUsed++;
      
      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
          ...(provider.name === 'OpenRouter' && {
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'AI Business Intelligence'
          })
        },
        body: JSON.stringify({
          model: provider.model,
          messages,
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`${provider.name} API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        provider: provider.name,
        model: provider.model
      };
    } catch (error) {
      provider.requestsUsed--; // Rollback on error
      throw error;
    }
  }

  async generateBusinessIdeas(industry?: string, constraints?: Record<string, unknown>): Promise<{content: string; provider: string; model: string}> {
    const prompt = this.buildBusinessIdeaPrompt(industry, constraints);
    
    const messages = [
      {
        role: 'system',
        content: `You are an elite business strategist and market analyst with 20+ years of experience identifying breakthrough opportunities. 

CONTEXT: Analyze current market trends, emerging technologies, and consumer behavior patterns to identify high-potential AI/SaaS business opportunities.

RESEARCH PARAMETERS:
- Market size: Minimum $10M TAM
- Competition level: Low to moderate
- Technical feasibility: Achievable by small team
- Time to market: 3-12 months
- Monetization clarity: Clear revenue model

ANALYSIS FRAMEWORK:
1. Trend Analysis: What macro trends are converging?
2. Pain Point Identification: What problems are underserved?
3. Technology Enablers: What new capabilities make this possible now?
4. Market Validation: What evidence suggests demand exists?
5. Competitive Landscape: Who else is in this space and what gaps exist?

OUTPUT FORMAT:
For each idea, provide:
- **Idea Name**: Catchy, memorable title
- **One-Liner**: Clear value proposition
- **Market Opportunity**: Size, growth rate, trends
- **Target Customer**: Specific avatar with pain points
- **Solution Approach**: How AI/technology solves the problem
- **Revenue Model**: How money is made
- **Competitive Advantage**: What makes this defensible
- **Implementation Roadmap**: 3-6 month milestones
- **Risk Assessment**: What could go wrong
- **Success Metrics**: How to measure progress

Be brutally honest about challenges while remaining optimistic about opportunities. Think like a successful entrepreneur who has built and sold multiple companies.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.makeRequest(messages, { maxTokens: 3000, temperature: 0.8 });
  }

  async analyzeCompetitor(companyName: string, businessIdea?: string): Promise<{content: string; provider: string; model: string}> {
    const prompt = `Conduct a comprehensive competitive intelligence analysis for "${companyName}" ${businessIdea ? `in the context of this business idea: "${businessIdea}"` : ''}.

INVESTIGATION AREAS:
1. **Business Model Dissection**
   - Revenue streams and pricing strategy
   - Customer acquisition approach
   - Value proposition positioning
   - Operational structure

2. **Product Analysis**
   - Feature set and capabilities
   - User experience strengths/weaknesses
   - Technical architecture insights
   - Development roadmap signals

3. **Market Position**
   - Brand perception and messaging
   - Customer segment focus
   - Partnership ecosystem
   - Geographic presence

4. **Strategic Vulnerabilities**
   - Product gaps and blind spots
   - Customer complaint patterns
   - Organizational weaknesses
   - Technology debt indicators

5. **Opportunity Identification**
   - Underserved customer segments
   - Feature gaps to exploit
   - Positioning opportunities
   - Partnership possibilities

OUTPUT: Deliver a strategic intelligence report that would cost $50K from McKinsey, but focus on actionable insights an entrepreneur can immediately use to compete and win.`;

    const messages = [
      {
        role: 'system',
        content: 'You are a competitive intelligence expert specializing in AI/SaaS markets. Your job is to conduct deep competitor analysis that reveals strategic insights most entrepreneurs miss.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.makeRequest(messages, { maxTokens: 2500, temperature: 0.7 });
  }

  private buildBusinessIdeaPrompt(industry?: string, constraints?: Record<string, unknown>): string {
    let prompt = 'Generate 3-5 high-potential AI/SaaS business opportunities that are underexplored in the current market.';
    
    if (industry) {
      prompt += ` Focus specifically on the ${industry} industry.`;
    }
    
    if (constraints) {
      if (constraints.budget) prompt += ` Consider a budget constraint of $${constraints.budget}.`;
      if (constraints.timeframe) prompt += ` Target time to market of ${constraints.timeframe} months.`;
      if (constraints.teamSize) prompt += ` Assume a team size of ${constraints.teamSize} people.`;
    }
    
    prompt += `

Focus on opportunities that:
- Address real, painful problems
- Have clear monetization paths
- Can be validated quickly
- Have defensible competitive advantages
- Leverage current AI/ML capabilities
- Target growing market segments

Avoid:
- Oversaturated markets
- Regulatory-heavy industries
- Ideas requiring massive capital
- Complex hardware requirements
- Ideas without clear customer willingness to pay`;

    return prompt;
  }
}

export const llmLoadBalancer = new LLMLoadBalancer();
