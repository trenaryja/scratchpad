"use client"
import { useLocalStorage } from "./use-local-storage"
import { useCallback } from "react"

interface CachedDocument {
  id: string
  title: string
  lastModified: number
}

export function useDocumentCache() {
  const [documents, setDocuments] = useLocalStorage<CachedDocument[]>("document-cache", [])

  const addDocument = useCallback(
    (id: string, title: string) => {
      setDocuments((prev) => {
        const existing = prev.find((doc) => doc.id === id)
        const now = Date.now()

        if (existing) {
          // Only update if title actually changed
          if (existing.title !== title) {
            return prev.map((doc) => (doc.id === id ? { ...doc, title, lastModified: now } : doc))
          }
          return prev // No change needed
        }

        // Add new document
        return [...prev, { id, title, lastModified: now }]
      })
    },
    [setDocuments],
  )

  const hideDocument = useCallback(
    (id: string) => {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    },
    [setDocuments],
  )

  const exportCache = useCallback(() => {
    const dataStr = JSON.stringify(documents, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "markdown-scratchpad-cache.json"
    link.click()
    URL.revokeObjectURL(url)
  }, [documents])

  const importCache = useCallback(
    (data: CachedDocument[]) => {
      if (Array.isArray(data)) {
        setDocuments(data)
      }
    },
    [setDocuments],
  )

  return {
    documents,
    addDocument,
    hideDocument,
    exportCache,
    importCache,
  }
}
