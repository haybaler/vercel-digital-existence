'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2, Plus, X, Brain, Globe, Building, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function NewResearchPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [sources, setSources] = useState<string[]>([''])
  const [depth, setDepth] = useState<'quick' | 'standard' | 'comprehensive'>('standard')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: 'web',
      title: 'Web Research',
      description: 'General web research with multiple sources',
      icon: Globe,
      example: 'Latest trends in artificial intelligence for healthcare'
    },
    {
      id: 'company',
      title: 'Company Analysis',
      description: 'Deep company intelligence and analysis',
      icon: Building,
      example: 'Microsoft financial performance and market position 2024'
    },
    {
      id: 'market',
      title: 'Market Research',
      description: 'Market trends and industry analysis',
      icon: TrendingUp,
      example: 'Electric vehicle market growth and opportunities'
    }
  ]

  const addSource = () => {
    setSources([...sources, ''])
  }

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const updateSource = (index: number, value: string) => {
    const newSources = [...sources]
    newSources[index] = value
    setSources(newSources)
  }

  const useTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template.id)
    setQuery(template.example)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return

    setIsLoading(true)

    try {
      const validSources = sources.filter(source => source.trim())
      
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          sources: validSources.length > 0 ? validSources : undefined,
          depth
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/research/${data.data.sessionId}`)
      } else {
        throw new Error(data.error || 'Failed to start research')
      }
    } catch (error) {
      console.error('Research submission error:', error)
      alert('Failed to start research. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/research" className="text-blue-600 hover:text-blue-700 mr-4">
                ← Research
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Research Project
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="text-center mb-8">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start New Research
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a template or create a custom research query
            </p>
          </div>

          {/* Templates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {templates.map((template) => {
              const Icon = template.icon
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900' 
                      : ''
                  }`}
                  onClick={() => useTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-blue-600 mr-2" />
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 italic">
                      "{template.example}"
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Research Form */}
          <Card>
            <CardHeader>
              <CardTitle>Research Configuration</CardTitle>
              <CardDescription>
                Customize your research parameters for optimal results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Query Input */}
                <div>
                  <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Research Query *
                  </label>
                  <textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What would you like to research? Be specific for better results..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Examples: "AI trends in healthcare 2024", "Tesla market position analysis", "Remote work productivity statistics"
                  </p>
                </div>

                {/* Research Depth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Research Depth
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'quick', label: 'Quick', desc: '3-5 sources, fast results' },
                      { value: 'standard', label: 'Standard', desc: '5-10 sources, balanced' },
                      { value: 'comprehensive', label: 'Comprehensive', desc: '10-15 sources, thorough' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDepth(option.value as any)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          depth === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Sources */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Sources (Optional)
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Add specific URLs to research. Leave empty to search the web automatically.
                  </p>
                  <div className="space-y-2">
                    {sources.map((source, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={source}
                          onChange={(e) => updateSource(index, e.target.value)}
                          placeholder="https://example.com"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        {sources.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSource(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSource}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Source
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Link href="/research">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={!query.trim() || isLoading}
                    className="px-6"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Starting Research...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Start Research
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}