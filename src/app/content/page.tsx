"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner, LoadingCard } from '@/components/ui/loading'
import { BookOpen, MessageSquare, Mail, Search, Plus, FileText, Calendar } from 'lucide-react'

interface GeneratedContent {
  id: string
  type: string
  title: string
  content: string
  createdAt: string
  metadata?: {
    topic?: string
    seoScore?: number
    readingTime?: number
    tags?: string[]
  }
}

export default function ContentPage() {
  const [contentHistory, setContentHistory] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

  const contentTypes = [
    { id: 'blog', name: 'Blog Post', icon: BookOpen, description: 'Long-form articles and guides' },
    { id: 'social', name: 'Social Media', icon: MessageSquare, description: 'Platform-optimized posts' },
    { id: 'newsletter', name: 'Newsletter', icon: Mail, description: 'Email newsletter content' },
    { id: 'seo', name: 'SEO Content', icon: Search, description: 'Search-optimized content' }
  ]

  useEffect(() => {
    fetchContentHistory()
  }, [])

  const fetchContentHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        setContentHistory(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch content history:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = selectedType === 'all' 
    ? contentHistory 
    : contentHistory.filter(content => content.type.toLowerCase() === selectedType)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Generation</h1>
          <p className="text-muted-foreground mt-2">
            Create AI-powered content for blogs, social media, newsletters, and SEO
          </p>
        </div>
        <Button size="lg" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Content
        </Button>
      </div>

      {/* Content Type Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {contentTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card key={type.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Icon className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-lg">{type.name}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.location.href = `/content/${type.id}`}
                >
                  Create {type.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content History */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Recent Content</h2>
          <div className="flex gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All
            </Button>
            {contentTypes.map(type => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.id)}
              >
                {type.name}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <LoadingCard />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => (
              <Card key={content.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {content.type === 'BLOG' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {content.type === 'SOCIAL' && <MessageSquare className="h-4 w-4 text-green-600" />}
                      {content.type === 'NEWSLETTER' && <Mail className="h-4 w-4 text-purple-600" />}
                      {content.type === 'SEO' && <Search className="h-4 w-4 text-orange-600" />}
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                        {content.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(content.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {content.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {content.content.replace(/[#*_`]/g, '').substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {content.metadata?.readingTime && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {content.metadata.readingTime} min read
                        </span>
                      )}
                      {content.metadata?.seoScore && (
                        <span className="flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          SEO: {content.metadata.seoScore}/10
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No content yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first piece of AI-generated content to get started.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}