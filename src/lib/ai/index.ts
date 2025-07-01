import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'

export type AIProvider = 'openai' | 'anthropic' | 'google'

export interface AIConfig {
  provider: AIProvider
  model: string
  temperature?: number
  maxTokens?: number
}

// Default AI configurations
export const AI_CONFIGS: Record<string, AIConfig> = {
  research: {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    temperature: 0.3,
    maxTokens: 4000
  },
  content: {
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    temperature: 0.7,
    maxTokens: 4000
  },
  analysis: {
    provider: 'google',
    model: 'gemini-pro',
    temperature: 0.2,
    maxTokens: 2000
  }
}

// Get AI model based on provider and model name
export function getAIModel(provider: AIProvider, model: string) {
  switch (provider) {
    case 'openai':
      return openai(model)
    case 'anthropic':
      return anthropic(model)
    case 'google':
      return google(model)
    default:
      throw new Error(`Unsupported AI provider: ${provider}`)
  }
}

// Generate text with AI
export async function generateAIText(
  prompt: string,
  config: AIConfig = AI_CONFIGS.research
) {
  const model = getAIModel(config.provider, config.model)
  
  const result = await generateText({
    model,
    prompt,
    temperature: config.temperature,
    maxTokens: config.maxTokens
  })
  
  return result.text
}

// Generate structured data with AI
export async function generateAIObject<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  config: AIConfig = AI_CONFIGS.analysis
): Promise<T> {
  const model = getAIModel(config.provider, config.model)
  
  const result = await generateObject({
    model,
    prompt,
    schema,
    temperature: config.temperature,
    maxTokens: config.maxTokens
  })
  
  return result.object
}

// Research-specific AI functions
export const ResearchResultSchema = z.object({
  summary: z.string().describe('Brief summary of the research findings'),
  keyPoints: z.array(z.string()).describe('Key points discovered during research'),
  sources: z.array(z.object({
    url: z.string(),
    title: z.string(),
    relevance: z.number().min(0).max(10),
    summary: z.string()
  })).describe('Relevant sources found'),
  insights: z.array(z.string()).describe('Insights and conclusions drawn'),
  recommendations: z.array(z.string()).describe('Recommended next steps or actions'),
  confidence: z.number().min(0).max(10).describe('Confidence level in the research results')
})

export type ResearchResult = z.infer<typeof ResearchResultSchema>

export async function analyzeResearchData(
  query: string,
  webData: Array<{ url: string; title: string; content: string }>,
  config?: AIConfig
): Promise<ResearchResult> {
  const prompt = `
Analyze the following research data for the query: "${query}"

Web Data:
${webData.map(item => `
URL: ${item.url}
Title: ${item.title}
Content: ${item.content.slice(0, 2000)}...
`).join('\n---\n')}

Based on this information, provide a comprehensive research analysis including:
1. A clear summary of findings
2. Key points discovered
3. Source relevance and credibility
4. Insights and conclusions
5. Recommendations for next steps
6. Your confidence level in these results

Be thorough, accurate, and cite specific sources where relevant.
`

  return generateAIObject(prompt, ResearchResultSchema, config)
}

// Content generation functions
export const ContentSchema = z.object({
  title: z.string().describe('Engaging title for the content'),
  content: z.string().describe('Main content body'),
  summary: z.string().describe('Brief summary or excerpt'),
  tags: z.array(z.string()).describe('Relevant tags or keywords'),
  seoKeywords: z.array(z.string()).describe('SEO-optimized keywords'),
  readingTime: z.number().describe('Estimated reading time in minutes'),
  tone: z.enum(['professional', 'casual', 'technical', 'creative']).describe('Content tone'),
  wordCount: z.number().describe('Total word count')
})

export type ContentResult = z.infer<typeof ContentSchema>

export async function generateContent(
  type: 'blog' | 'social' | 'newsletter' | 'seo',
  topic: string,
  researchData?: string,
  config?: AIConfig
): Promise<ContentResult> {
  const typePrompts = {
    blog: 'Create a comprehensive blog post',
    social: 'Create engaging social media content',
    newsletter: 'Create a newsletter section',
    seo: 'Create SEO-optimized content'
  }

  const prompt = `
${typePrompts[type]} about: "${topic}"

${researchData ? `Based on this research data:\n${researchData}\n` : ''}

Requirements:
- ${type === 'blog' ? 'Long-form, detailed content with clear structure' : ''}
- ${type === 'social' ? 'Concise, engaging, platform-ready content' : ''}
- ${type === 'newsletter' ? 'Informative, scannable content with clear value' : ''}
- ${type === 'seo' ? 'Search engine optimized with target keywords' : ''}
- Professional tone with clear value proposition
- Include relevant keywords and tags
- Estimate reading time accurately

Generate high-quality content that provides real value to the target audience.
`

  return generateAIObject(prompt, ContentSchema, config)
}

// Trend analysis functions
export const TrendAnalysisSchema = z.object({
  trends: z.array(z.object({
    topic: z.string(),
    description: z.string(),
    relevance: z.number().min(0).max(10),
    momentum: z.enum(['rising', 'stable', 'declining']),
    timeframe: z.string(),
    sources: z.array(z.string())
  })).describe('Identified trends'),
  insights: z.array(z.string()).describe('Key insights about the trends'),
  recommendations: z.array(z.string()).describe('Actionable recommendations'),
  riskFactors: z.array(z.string()).describe('Potential risks or concerns'),
  opportunities: z.array(z.string()).describe('Potential opportunities')
})

export type TrendAnalysis = z.infer<typeof TrendAnalysisSchema>

export async function analyzeTrends(
  data: Array<{ source: string; content: string; timestamp: Date }>,
  keywords: string[],
  config?: AIConfig
): Promise<TrendAnalysis> {
  const prompt = `
Analyze the following data for emerging trends related to keywords: ${keywords.join(', ')}

Data Sources:
${data.map(item => `
Source: ${item.source}
Timestamp: ${item.timestamp.toISOString()}
Content: ${item.content.slice(0, 1000)}...
`).join('\n---\n')}

Identify and analyze:
1. Emerging trends and patterns
2. Trend momentum and direction
3. Relevance to the specified keywords
4. Key insights and implications
5. Actionable recommendations
6. Risk factors to consider
7. Potential opportunities

Provide a comprehensive trend analysis with specific evidence from the sources.
`

  return generateAIObject(prompt, TrendAnalysisSchema, config)
}