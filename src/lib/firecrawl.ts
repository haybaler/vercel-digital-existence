import FirecrawlApp from '@mendable/firecrawl-js'

if (!process.env.FIRECRAWL_API_KEY) {
  throw new Error('FIRECRAWL_API_KEY is not set in environment variables')
}

export const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY
})

export interface FirecrawlScrapeOptions {
  formats?: ('markdown' | 'html' | 'rawHtml')[]
  includeTags?: string[]
  excludeTags?: string[]
  onlyMainContent?: boolean
  timeout?: number
}

export interface FirecrawlSearchOptions {
  query: string
  limit?: number
  format?: 'markdown' | 'html'
  includeTags?: string[]
  excludeTags?: string[]
}

export interface FirecrawlCrawlOptions {
  limit?: number
  scrapeOptions?: FirecrawlScrapeOptions
  allowBackwardCrawling?: boolean
  allowExternalContentLinks?: boolean
}

export interface ScrapeResult {
  url: string
  markdown?: string
  html?: string
  rawHtml?: string
  metadata: {
    title: string
    description?: string
    language?: string
    sourceURL: string
    [key: string]: any
  }
  llm_extraction?: any
  warning?: string
}

export interface SearchResult {
  url: string
  title: string
  description: string
  markdown: string
  metadata: Record<string, any>
}

export interface CrawlResult {
  success: boolean
  data?: ScrapeResult[]
  error?: string
}

// Core Firecrawl functions
export async function scrapeUrl(
  url: string, 
  options: FirecrawlScrapeOptions = {}
): Promise<ScrapeResult> {
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: options.formats || ['markdown'],
      includeTags: options.includeTags,
      excludeTags: options.excludeTags,
      onlyMainContent: options.onlyMainContent ?? true,
      timeout: options.timeout || 30000
    })
    
    return result as ScrapeResult
  } catch (error) {
    console.error('Firecrawl scrape error:', error)
    throw new Error(`Failed to scrape URL: ${error}`)
  }
}

export async function searchWeb(
  query: string,
  options: FirecrawlSearchOptions = {}
): Promise<SearchResult[]> {
  try {
    const result = await firecrawl.search(query, {
      limit: options.limit || 10,
      format: options.format || 'markdown',
      includeTags: options.includeTags,
      excludeTags: options.excludeTags
    })
    
    return result.data as SearchResult[]
  } catch (error) {
    console.error('Firecrawl search error:', error)
    throw new Error(`Failed to search: ${error}`)
  }
}

export async function crawlWebsite(
  url: string,
  options: FirecrawlCrawlOptions = {}
): Promise<CrawlResult> {
  try {
    const result = await firecrawl.crawlUrl(url, {
      limit: options.limit || 100,
      scrapeOptions: {
        formats: ['markdown'],
        onlyMainContent: true,
        ...options.scrapeOptions
      },
      allowBackwardCrawling: options.allowBackwardCrawling ?? false,
      allowExternalContentLinks: options.allowExternalContentLinks ?? false
    })
    
    return {
      success: true,
      data: result.data as ScrapeResult[]
    }
  } catch (error) {
    console.error('Firecrawl crawl error:', error)
    return {
      success: false,
      error: `Failed to crawl website: ${error}`
    }
  }
}

// Helper function to extract structured data
export async function extractData(
  url: string,
  schema: Record<string, any>
): Promise<any> {
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['extract'],
      extract: {
        schema: schema
      }
    })
    
    return result.llm_extraction
  } catch (error) {
    console.error('Firecrawl extraction error:', error)
    throw new Error(`Failed to extract data: ${error}`)
  }
}