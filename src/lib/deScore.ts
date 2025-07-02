import { db } from './db'
import { scrapeUrl } from './firecrawl'

export interface DEScoreResult {
  projectId: string
  brandScore: number
  operationsScore: number
  paidScore: number
  totalScore: number
  breakdown: Record<string, any>
}

export interface SEOAnalysisResult {
  titleScore: number
  metaDescriptionScore: number
  headingStructureScore: number
  contentLengthScore: number
  keywordDensityScore: number
  internalLinksScore: number
  imageOptimizationScore: number
  overallScore: number
}

export interface TechnicalAuditResult {
  performanceScore: number
  accessibilityScore: number
  mobileOptimizationScore: number
  securityScore: number
  codeQualityScore: number
  overallScore: number
}

export interface WallflowerAnalysisResult {
  contentRichnessScore: number
  visualElementsScore: number
  userEngagementScore: number
  brandPresenceScore: number
  overallScore: number
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round(sum / values.length)
}

function analyzeContent(content: string, url: string): {
  wordCount: number
  paragraphs: number
  headers: number
  links: number
  images: number
  hasTitle: boolean
  hasMetaDescription: boolean
} {
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  const paragraphs = (content.match(/\n\n+/g) || []).length + 1
  const headers = (content.match(/^#{1,6}\s/gm) || []).length
  const links = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length
  const images = (content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length
  const hasTitle = /^#\s/.test(content)
  const hasMetaDescription = content.includes('description') || content.length > 160

  return {
    wordCount,
    paragraphs,
    headers,
    links,
    images,
    hasTitle,
    hasMetaDescription
  }
}

function calculateSEOScore(content: string, url: string): SEOAnalysisResult {
  const analysis = analyzeContent(content, url)
  
  // Title optimization (0-100)
  const titleScore = analysis.hasTitle ? 
    Math.min(100, 60 + (analysis.headers > 0 ? 40 : 0)) : 20

  // Meta description (0-100)
  const metaDescriptionScore = analysis.hasMetaDescription ? 
    Math.min(100, 70 + (content.length > 160 && content.length < 320 ? 30 : 0)) : 10

  // Heading structure (0-100)
  const headingStructureScore = Math.min(100, analysis.headers * 15)

  // Content length (0-100)
  const contentLengthScore = analysis.wordCount < 300 ? 
    Math.round(analysis.wordCount / 3) : 
    Math.min(100, 60 + Math.round((analysis.wordCount - 300) / 50))

  // Keyword density approximation (0-100)
  const keywordDensityScore = analysis.wordCount > 100 ? 
    Math.min(100, 50 + Math.round(analysis.wordCount / 100)) : 30

  // Internal links (0-100)
  const internalLinksScore = Math.min(100, analysis.links * 20)

  // Image optimization (0-100)
  const imageOptimizationScore = analysis.images > 0 ? 
    Math.min(100, 40 + analysis.images * 10) : 20

  const overallScore = average([
    titleScore,
    metaDescriptionScore,
    headingStructureScore,
    contentLengthScore,
    keywordDensityScore,
    internalLinksScore,
    imageOptimizationScore
  ])

  return {
    titleScore,
    metaDescriptionScore,
    headingStructureScore,
    contentLengthScore,
    keywordDensityScore,
    internalLinksScore,
    imageOptimizationScore,
    overallScore
  }
}

function calculateTechnicalAudit(content: string, url: string): TechnicalAuditResult {
  // Performance indicators from content analysis
  const analysis = analyzeContent(content, url)
  
  // Performance score based on content efficiency
  const performanceScore = Math.min(100, 
    70 - Math.round(analysis.images / 5) + 
    (analysis.wordCount > 5000 ? -10 : 0) +
    (content.length < 50000 ? 20 : 0)
  )

  // Accessibility score based on structure
  const accessibilityScore = Math.min(100,
    (analysis.headers > 0 ? 25 : 0) +
    (analysis.hasTitle ? 25 : 0) +
    (analysis.images > 0 ? 15 : 0) +
    35 // Base accessibility score
  )

  // Mobile optimization (estimated from content structure)
  const mobileOptimizationScore = Math.min(100,
    (analysis.paragraphs > 3 ? 20 : 40) + // Shorter paragraphs better for mobile
    (analysis.wordCount < 2000 ? 30 : 20) + // Reasonable content length
    30 // Base mobile score
  )

  // Security score (basic URL analysis)
  const securityScore = url.startsWith('https://') ? 
    Math.min(100, 80 + (url.includes('www.') ? 20 : 0)) : 40

  // Code quality (estimated from content structure)
  const codeQualityScore = Math.min(100,
    (analysis.headers > 0 ? 20 : 0) +
    (analysis.links > 0 ? 15 : 0) +
    (analysis.hasTitle ? 15 : 0) +
    50 // Base code quality
  )

  const overallScore = average([
    performanceScore,
    accessibilityScore,
    mobileOptimizationScore,
    securityScore,
    codeQualityScore
  ])

  return {
    performanceScore,
    accessibilityScore,
    mobileOptimizationScore,
    securityScore,
    codeQualityScore,
    overallScore
  }
}

function calculateWallflowerAnalysis(content: string, url: string): WallflowerAnalysisResult {
  const analysis = analyzeContent(content, url)
  
  // Content richness based on depth and variety
  const contentRichnessScore = Math.min(100,
    Math.round(analysis.wordCount / 50) + 
    (analysis.paragraphs * 5) +
    (analysis.headers * 3)
  )

  // Visual elements score
  const visualElementsScore = Math.min(100,
    (analysis.images * 15) +
    (analysis.headers > 0 ? 20 : 0) +
    30 // Base visual score
  )

  // User engagement indicators
  const userEngagementScore = Math.min(100,
    (analysis.links * 10) +
    (analysis.wordCount > 500 ? 25 : 10) +
    (analysis.paragraphs > 5 ? 15 : 5) +
    20 // Base engagement
  )

  // Brand presence (estimated from content structure and completeness)
  const brandPresenceScore = Math.min(100,
    (analysis.hasTitle ? 30 : 0) +
    (analysis.hasMetaDescription ? 20 : 0) +
    (analysis.wordCount > 300 ? 30 : 10) +
    (analysis.images > 0 ? 20 : 0)
  )

  const overallScore = average([
    contentRichnessScore,
    visualElementsScore,
    userEngagementScore,
    brandPresenceScore
  ])

  return {
    contentRichnessScore,
    visualElementsScore,
    userEngagementScore,
    brandPresenceScore,
    overallScore
  }
}

export async function analyzeProject(domain: string, userId: string): Promise<DEScoreResult> {
  try {
    // Create or find project
    const project = await db.project.upsert({
      where: { domain },
      update: { updatedAt: new Date() },
      create: { domain, name: domain, userId }
    })

    // Scrape website content
    const scraped = await scrapeUrl(domain.startsWith('http') ? domain : `https://${domain}`)
    const content = scraped.markdown || scraped.html || ''
    
    if (!content || content.length < 50) {
      throw new Error('Unable to analyze website - insufficient content retrieved')
    }

    // Perform real analysis
    const seoAnalysis = calculateSEOScore(content, domain)
    const technicalAudit = calculateTechnicalAudit(content, domain)
    const wallflowerAnalysis = calculateWallflowerAnalysis(content, domain)

    // Calculate operations score (placeholder for now, but more realistic)
    const operationsScore = Math.min(100, 
      50 + // Base operations score
      (seoAnalysis.overallScore > 70 ? 15 : 0) +
      (technicalAudit.overallScore > 70 ? 15 : 0) +
      (wallflowerAnalysis.overallScore > 70 ? 20 : 0)
    )

    // Paid ads score (placeholder but more realistic)
    const paidScore = Math.min(100,
      40 + // Base paid score
      (seoAnalysis.overallScore > 60 ? 20 : 0) +
      (technicalAudit.performanceScore > 70 ? 20 : 0) +
      (wallflowerAnalysis.brandPresenceScore > 60 ? 20 : 0)
    )

    // Store detailed analysis results
    await Promise.all([
      db.wallflowerAnalysis.create({
        data: {
          projectId: project.id,
          score: wallflowerAnalysis.overallScore,
          data: wallflowerAnalysis
        }
      }),
      db.sEOAnalysis.create({
        data: {
          projectId: project.id,
          score: seoAnalysis.overallScore,
          data: seoAnalysis
        }
      }),
      db.technicalAudit.create({
        data: {
          projectId: project.id,
          score: technicalAudit.overallScore,
          data: technicalAudit
        }
      }),
      db.paidAdsMetric.create({
        data: {
          projectId: project.id,
          score: paidScore,
          data: { 
            estimatedScore: paidScore,
            note: 'Estimated based on SEO and technical performance'
          }
        }
      }),
      db.operationsAssessment.create({
        data: {
          projectId: project.id,
          score: operationsScore,
          data: {
            estimatedScore: operationsScore,
            note: 'Estimated based on overall digital presence'
          }
        }
      })
    ])

    // Calculate overall scores
    const brandScore = average([
      wallflowerAnalysis.overallScore,
      seoAnalysis.overallScore,
      technicalAudit.overallScore
    ])

    const totalScore = average([brandScore, operationsScore, paidScore])

    const breakdown = {
      wallflowerScore: wallflowerAnalysis.overallScore,
      seoScore: seoAnalysis.overallScore,
      technicalScore: technicalAudit.overallScore,
      operationsScore,
      paidScore,
      details: {
        seoAnalysis,
        technicalAudit,
        wallflowerAnalysis
      }
    }

    // Store final DE Score
    const deScore = await db.dEScore.create({
      data: {
        projectId: project.id,
        brandScore,
        operationsScore,
        paidScore,
        totalScore,
        breakdown
      }
    })

    return {
      projectId: project.id,
      brandScore,
      operationsScore,
      paidScore,
      totalScore,
      breakdown
    }

  } catch (error) {
    console.error('DE Score analysis error:', error)
    throw new Error(`Failed to analyze project: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
