import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v2 as cloudinary } from 'cloudinary'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Configure Cloudinary if credentials are provided
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// Configure AWS S3 if credentials are provided
let s3Client: S3Client | null = null
if (process.env.AWS_ACCESS_KEY_ID) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  })
}

export interface UploadResult {
  url: string
  key: string
  size: number
}

export async function uploadFile(file: File, folder = 'uploads'): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${file.name}`
  
  // Try AWS S3 first
  if (s3Client && process.env.AWS_S3_BUCKET) {
    return uploadToS3(buffer, filename, folder, file.type)
  }
  
  // Try Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return uploadToCloudinary(buffer, filename, folder)
  }
  
  // Fallback to local storage
  return uploadToLocal(buffer, filename, folder)
}

async function uploadToS3(
  buffer: Buffer,
  filename: string,
  folder: string,
  contentType: string
): Promise<UploadResult> {
  const key = `${folder}/${filename}`
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })
  
  await s3Client!.send(command)
  
  const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
  
  return {
    url,
    key,
    size: buffer.length,
  }
}

async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename.split('.')[0],
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            url: result.secure_url,
            key: result.public_id,
            size: result.bytes,
          })
        }
      }
    ).end(buffer)
  })
}

async function uploadToLocal(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<UploadResult> {
  const uploadsDir = join(process.cwd(), 'public', folder)
  await mkdir(uploadsDir, { recursive: true })
  
  const filepath = join(uploadsDir, filename)
  await writeFile(filepath, buffer)
  
  const url = `/${folder}/${filename}`
  
  return {
    url,
    key: filename,
    size: buffer.length,
  }
}

export async function deleteFile(key: string, folder = 'uploads'): Promise<void> {
  // Try AWS S3 first
  if (s3Client && process.env.AWS_S3_BUCKET) {
    // Implementation for S3 delete
    return
  }
  
  // Try Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    await cloudinary.uploader.destroy(key)
    return
  }
  
  // Local storage delete
  try {
    const { unlink } = await import('fs/promises')
    const filepath = join(process.cwd(), 'public', folder, key)
    await unlink(filepath)
  } catch (error) {
    console.error('Failed to delete local file:', error)
  }
}