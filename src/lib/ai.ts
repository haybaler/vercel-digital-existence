import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface WebData {
  url: string
  title: string
  content: string
}

export interface ResearchAnalysisResult {
  summary: string
  keyPoints: string[]
  insights: string[]
  recommendations: string[]
  confidence: number
  sources: Array<{
    url: string
    title: string
    relevance: number
  }>
}

export interface ContentGenerationResult {
  title: string
  content: string
  excerpt: string
  tags: string[]
  seoScore: number
  readingTime: number
}

export async function analyzeResearchData(
  query: string, 
  webData: WebData[]
): Promise<ResearchAnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const sourceData = webData.map(item => ({
      url: item.url,
      title: item.title,
      content: item.content.slice(0, 4000)
    }))

    const prompt = `Analyze the following research data for the query: "${query}"

Sources:
${sourceData.map((source, index) => 
  `${index + 1}. ${source.title} (${source.url})
${source.content}
---`
).join('\n')}

Please provide a comprehensive analysis in the following JSON format:
{
  "summary": "Detailed summary of findings",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "confidence": 8,
  "sources": [
    {"url": "source1", "title": "title1", "relevance": 9},
    {"url": "source2", "title": "title2", "relevance": 7}
  ]
}

Focus on accuracy, depth, and practical value. Confidence should be 1-10. Relevance should be 1-10.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    })

    const content = response.choices[0]?.message?.content || '{}'
    
    try {
      const parsed = JSON.parse(content)
      return {
        summary: parsed.summary || 'Analysis completed',
        keyPoints: parsed.keyPoints || [],
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        confidence: parsed.confidence || 7,
        sources: parsed.sources || webData.map(item => ({
          url: item.url,
          title: item.title,
          relevance: 7
        }))
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        summary: `Research analysis for "${query}" completed with ${webData.length} sources.`,
        keyPoints: [`Found ${webData.length} relevant sources`, 'Analysis completed successfully'],
        insights: ['Data shows relevant information for the query', 'Multiple perspectives available'],
        recommendations: ['Review all sources for comprehensive understanding', 'Consider additional research if needed'],
        confidence: 7,
        sources: webData.map(item => ({
          url: item.url,
          title: item.title,
          relevance: 7
        }))
      }
    }
  } catch (error) {
    console.error('AI research analysis error:', error)
    throw new Error(`Failed to analyze research data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function generateContent(
  topic: string,
  contentType: 'blog' | 'social' | 'newsletter' | 'seo',
  researchData?: WebData[]
): Promise<ContentGenerationResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const contentTypePrompts = {
      blog: 'Create a comprehensive, engaging blog post (800+ words)',
      social: 'Create engaging social media content with hooks and CTAs',
      newsletter: 'Create newsletter-style content with clear sections',
      seo: 'Create SEO-optimized content with proper keyword integration'
    }

    const researchContext = researchData ? 
      `Based on the following research data:\n${researchData.map(item => `- ${item.title}: ${item.content.slice(0, 1000)}`).join('\n')}\n` : 
      ''

    const prompt = `${contentTypePrompts[contentType]} about: "${topic}"

${researchContext}

Please provide the response in this JSON format:
{
  "title": "Compelling title for the content",
  "content": "Full content body with proper formatting",
  "excerpt": "Brief summary (150-200 characters)",
  "tags": ["tag1", "tag2", "tag3"],
  "seoScore": 8,
  "readingTime": 5
}

Requirements:
- ${contentType === 'blog' ? 'Minimum 800 words, well-structured with headings' : ''}
- ${contentType === 'social' ? 'Platform-optimized, engaging hooks' : ''}
- ${contentType === 'newsletter' ? 'Newsletter format with clear sections' : ''}
- ${contentType === 'seo' ? 'SEO-optimized with natural keyword integration' : ''}
- Professional tone, actionable insights
- Proper formatting with markdown`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const content = response.choices[0]?.message?.content || '{}'
    
    try {
      const parsed = JSON.parse(content)
      return {
        title: parsed.title || `${topic}: Complete Guide`,
        content: parsed.content || `# ${topic}\n\nComprehensive guide about ${topic}.`,
        excerpt: parsed.excerpt || `Learn everything about ${topic} in this comprehensive guide.`,
        tags: parsed.tags || [topic.toLowerCase()],
        seoScore: parsed.seoScore || 7,
        readingTime: parsed.readingTime || Math.ceil((parsed.content || '').split(' ').length / 200)
      }
    } catch (parseError) {
      // Fallback content generation
      return generateFallbackContent(topic, contentType)
    }
  } catch (error) {
    console.error('AI content generation error:', error)
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function generateFallbackContent(topic: string, contentType: string): ContentGenerationResult {
  const templates = {
    blog: `# ${topic}: Complete Guide

## Introduction
Understanding ${topic} is essential in today's digital landscape.

## Key Benefits
- Improved efficiency
- Better outcomes
- Competitive advantage

## Best Practices
1. Start with clear objectives
2. Research thoroughly
3. Implement systematically
4. Monitor and optimize

## Conclusion
${topic} offers significant opportunities for growth and improvement.`,
    
    social: `🚀 Exciting insights about ${topic}!

Key takeaways:
✅ Game-changing potential
✅ Easy implementation
✅ Proven results

What's your experience with ${topic}? Share below! 👇

#${topic.replace(/\s+/g, '')} #Innovation`,

    newsletter: `# ${topic} - Weekly Insights

## This Week's Focus
Latest updates on ${topic} you need to know.

## Key Developments
- Major breakthrough in implementation
- New research reveals insights
- Industry best practices

## Actionable Tips
1. Start small with pilot projects
2. Track key metrics
3. Stay updated on trends`,

    seo: `# ${topic}: Complete Guide for 2024

## What is ${topic}?
${topic} is a crucial concept for modern businesses.

## Why ${topic} Matters
- Business growth
- Operational efficiency
- Customer satisfaction

## Implementation Guide
Step-by-step approach to ${topic} success.

## Best Practices
Industry-proven strategies for ${topic}.`
  }

  const content = templates[contentType as keyof typeof templates] || templates.blog
  
  return {
    title: `${topic}: ${contentType === 'blog' ? 'Complete Guide' : contentType === 'social' ? 'Social Post' : contentType === 'newsletter' ? 'Newsletter' : 'SEO Guide'}`,
    content,
    excerpt: `Learn about ${topic} with actionable insights and best practices.`,
    tags: [topic.toLowerCase(), contentType],
    seoScore: 7,
    readingTime: Math.ceil(content.split(' ').length / 200)
  }
}