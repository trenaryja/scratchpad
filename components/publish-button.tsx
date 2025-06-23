"use client"

import { useState } from "react"
import { Share, Check } from "lucide-react"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"
import { convexApi, safeUseMutation, isConvexAvailable } from "@/lib/convex-client"

interface PublishButtonProps {
  content: string
  title: string
}

export function PublishButton({ content, title }: PublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  // Safe mutation hook - won't break if Convex not available
  const createDocument = safeUseMutation(isConvexAvailable() ? convexApi.documents.createDocument : null)

  const handlePublish = async () => {
    if (!content.trim()) return

    setIsPublishing(true)
    try {
      const documentId = nanoid(8)

      if (isConvexAvailable() && createDocument) {
        // Create document in Convex
        await createDocument({
          nanoid: documentId,
          title: title || "Untitled Document",
          content,
        })
      } else {
        // Fallback to localStorage
        const document = {
          nanoid: documentId,
          title: title || "Untitled Document",
          content,
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        }
        localStorage.setItem(`document-${documentId}`, JSON.stringify(document))
      }

      // Copy URL to clipboard
      const url = `${window.location.origin}/${documentId}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      // Navigate to the published document
      router.push(`/${documentId}`)
    } catch (error) {
      console.error("Failed to publish:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!isConvexAvailable() && <div className="badge badge-warning badge-sm">Local Mode</div>}
      <button className="btn btn-primary btn-sm" onClick={handlePublish} disabled={isPublishing || !content.trim()}>
        {isPublishing ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Share className="h-4 w-4" />
        )}
        {isPublishing ? "Publishing..." : copied ? "Copied!" : "Publish"}
      </button>
    </div>
  )
}
