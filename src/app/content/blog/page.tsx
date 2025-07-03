"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading'
import { ArrowLeft, Wand2, FileText, Clock, Target, Tag } from 'lucide-react'

interface GeneratedContent {
  title: string
  content: string
  excerpt: string
  tags: string[]
  seoScore: number
  readingTime: number
}

export default function BlogGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    tone: 'professional',
    length: 'medium'
  })

  const handleGenerate = async () => {
    if (!formData.topic.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'blog',
          topic: formData.topic,
          targetKeywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
          tone: formData.tone,
          length: formData.length
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data.data)
      } else {
        console.error('Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Blog Post Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create comprehensive, engaging blog posts with AI assistance
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Configuration</CardTitle>
            <CardDescription>
              Provide details about the blog post you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topic */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic *</label>
              <input
                type="text"
                placeholder="e.g., Digital Marketing Trends 2024"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Keywords</label>
              <input
                type="text"
                placeholder="e.g., digital marketing, SEO, content strategy"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tone}
                onChange={(e) => setFormData({...formData, tone: e.target.value})}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            {/* Length */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Length</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.length}
                onChange={(e) => setFormData({...formData, length: e.target.value})}
              >
                <option value="short">Short (400-600 words)</option>
                <option value="medium">Medium (800-1200 words)</option>
                <option value="long">Long (1500+ words)</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!formData.topic.trim() || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Blog Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Preview your AI-generated blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-6">
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {generatedContent.readingTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    SEO Score: {generatedContent.seoScore}/10
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {generatedContent.tags.length} tags
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{generatedContent.title}</h2>
                  <p className="text-muted-foreground">{generatedContent.excerpt}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {generatedContent.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content Preview */}
                <div className="border-t pt-4">
                  <div className="prose prose-sm max-w-none">
                    {generatedContent.content.split('\n').slice(0, 10).map((line, index) => (
                      <p key={index} className="mb-2">
                        {line.replace(/^#+\s/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                      </p>
                    ))}
                    {generatedContent.content.split('\n').length > 10 && (
                      <p className="text-muted-foreground italic">
                        ... and more content
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1">
                    Save & Edit
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">
                  Fill in the form and click "Generate Blog Post" to create your content
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}