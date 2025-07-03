"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export function LoadingSpinnerWithText({ 
  text = "Loading...", 
  size = "md" 
}: LoadingSpinnerProps & { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <LoadingSpinner size={size} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg border">
        <LoadingSpinnerWithText text="Loading..." size="lg" />
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  )
}