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

export function average(values: number[]) {
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round(sum / values.length)
}

export async function analyzeProject(domain: string, userId?: string) {
  let projectId = 'demo'
  if (userId) {
    const project = await db.project.upsert({
      where: { domain },
      update: { updatedAt: new Date() },
      create: { domain, name: domain, userId }
    })
    projectId = project.id
  }

  const scraped = await scrapeUrl(domain)
  const content = scraped.markdown || ''
  const length = content.length

  const wallflowerScore = Math.min(100, Math.round(length / 1000))
  const seoScore = Math.min(100, Math.round(length / 800))
  const technicalScore = Math.min(100, 60)
  const operationsScore = 70
  const paidScore = 50

  if (userId) {
    await db.wallflowerAnalysis.create({
      data: {
        projectId,
        score: wallflowerScore,
        data: { contentLength: length }
      }
    })

    await db.sEOAnalysis.create({
      data: {
        projectId,
        score: seoScore,
        data: { contentLength: length }
      }
    })

    await db.technicalAudit.create({
      data: {
        projectId,
        score: technicalScore,
        data: { placeholder: true }
      }
    })

    await db.paidAdsMetric.create({
      data: {
        projectId,
        score: paidScore,
        data: { placeholder: true }
      }
    })

    await db.operationsAssessment.create({
      data: {
        projectId,
        score: operationsScore,
        data: { placeholder: true }
      }
    })
  }

  const brandScore = average([wallflowerScore, seoScore, technicalScore])
  const totalScore = average([brandScore, operationsScore, paidScore])
  const breakdown = {
    wallflowerScore,
    seoScore,
    technicalScore,
    operationsScore,
    paidScore
  }

  if (userId) {
    await db.dEScore.create({
      data: {
        projectId,
        brandScore,
        operationsScore,
        paidScore,
        totalScore,
        breakdown
      }
    })
  }

  const result: DEScoreResult = {
    projectId,
    brandScore,
    operationsScore,
    paidScore,
    totalScore,
    breakdown
  }
  return result
}
