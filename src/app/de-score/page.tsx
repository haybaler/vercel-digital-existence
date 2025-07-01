'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DEScorePage() {
  const { data: session } = useSession()
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

  if (!session) {
    return (
      <div className="p-8 text-center">Please sign in to calculate a DE Score.</div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
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
  )
}
