'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DEScorePage() {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/de-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.data)
      } else {
        alert(data.error || 'Failed to calculate score')
      }
    } catch (err) {
      console.error(err)
      alert('Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-[60vh]">
      <div className="w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Digital Existence Score</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="url"
              placeholder="https://example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Analyzing...' : 'Analyze Website'}
            </Button>
          </form>
          {result && (
            <div className="mt-6 space-y-2">
              <div>Total Score: {result.totalScore}</div>
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {JSON.stringify(result.breakdown, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
