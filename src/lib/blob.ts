import { put, del, list } from '@vercel/blob'

export interface BlobUploadResult {
  url: string
  pathname: string
  contentType?: string
  contentDisposition?: string
}

// Research report storage
export async function saveResearchReport(
  userId: string,
  sessionId: string,
  content: string,
  format: 'json' | 'pdf' | 'md' = 'json'
): Promise<BlobUploadResult> {
  const filename = `research-reports/${userId}/${sessionId}/report.${format}`
  
  const blob = await put(filename, content, {
    access: 'public',
    contentType: format === 'json' ? 'application/json' : 
                 format === 'pdf' ? 'application/pdf' : 'text/markdown'
  })
  
  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType,
    contentDisposition: blob.contentDisposition
  }
}

// Generated content storage
export async function saveGeneratedContent(
  userId: string,
  contentId: string,
  content: string,
  type: 'blog' | 'social' | 'newsletter' | 'seo',
  format: 'md' | 'html' | 'txt' = 'md'
): Promise<BlobUploadResult> {
  const filename = `content-exports/${userId}/${contentId}/${type}.${format}`
  
  const blob = await put(filename, content, {
    access: 'public',
    contentType: format === 'html' ? 'text/html' : 
                 format === 'md' ? 'text/markdown' : 'text/plain'
  })
  
  return blob
}

// User file uploads
export async function saveUserUpload(
  userId: string,
  file: File | Buffer,
  filename: string
): Promise<BlobUploadResult> {
  const pathname = `user-uploads/${userId}/${Date.now()}-${filename}`
  
  const blob = await put(pathname, file, {
    access: 'public'
  })
  
  return blob
}

// Screenshot storage for scraped content
export async function saveScreenshot(
  userId: string,
  sessionId: string,
  imageBuffer: Buffer,
  url: string
): Promise<BlobUploadResult> {
  const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '-')
  const filename = `research-reports/${userId}/${sessionId}/screenshots/${sanitizedUrl}.png`
  
  const blob = await put(filename, imageBuffer, {
    access: 'public',
    contentType: 'image/png'
  })
  
  return blob
}

// Large JSON data storage (for comprehensive research)
export async function saveLargeResearchData(
  userId: string,
  sessionId: string,
  data: any
): Promise<BlobUploadResult> {
  const filename = `research-data/${userId}/${sessionId}/full-data.json`
  
  const blob = await put(filename, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json'
  })
  
  return blob
}

// Export utilities
export async function exportResearchAsZip(
  userId: string,
  sessionId: string,
  researchData: any
): Promise<BlobUploadResult> {
  // Create a JSON file with all research data
  const exportData = {
    sessionId,
    exportedAt: new Date().toISOString(),
    ...researchData
  }
  
  const filename = `exports/${userId}/${sessionId}/research-export.json`
  
  const blob = await put(filename, JSON.stringify(exportData, null, 2), {
    access: 'public',
    contentType: 'application/json',
    contentDisposition: `attachment; filename="research-${sessionId}.json"`
  })
  
  return blob
}

// List user files
export async function listUserFiles(userId: string, prefix?: string) {
  const searchPrefix = prefix ? `${prefix}/${userId}` : userId
  
  const { blobs } = await list({
    prefix: searchPrefix,
    limit: 100
  })
  
  return blobs
}

// Delete file
export async function deleteFile(url: string): Promise<void> {
  await del(url)
}

// Generate download URL with expiration
export function generateDownloadUrl(blob: BlobUploadResult, filename?: string): string {
  if (filename) {
    const url = new URL(blob.url)
    url.searchParams.set('download', filename)
    return url.toString()
  }
  return blob.url
}