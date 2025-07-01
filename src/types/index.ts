// User and Authentication Types
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

// Research Types
export interface ResearchSession {
  id: string
  userId: string
  query: string
  results?: ResearchResult[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
}

export interface ResearchResult {
  id: string
  title: string
  url: string
  content: string
  summary: string
  relevanceScore: number
  sources: string[]
  metadata: Record<string, any>
}

// Content Generation Types
export interface GeneratedContent {
  id: string
  userId: string
  type: 'blog' | 'social' | 'newsletter' | 'seo'
  title: string
  content: string
  metadata: {
    wordCount: number
    readingTime: number
    seoScore?: number
    tags: string[]
    sources?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

// Trend Monitoring Types
export interface TrendMonitor {
  id: string
  userId: string
  name: string
  sources: TrendSource[]
  keywords: string[]
  status: 'active' | 'paused' | 'stopped'
  lastRun?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TrendSource {
  type: 'website' | 'social' | 'news'
  url?: string
  platform?: string
  keywords: string[]
}

export interface TrendAlert {
  id: string
  monitorId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  url?: string
  metadata: Record<string, any>
  createdAt: Date
}

// AI Provider Types
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'cohere' | 'groq'

export interface AIConfig {
  provider: AIProvider
  model: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}