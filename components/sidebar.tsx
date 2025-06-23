"use client"

import type React from "react"

import { useState } from "react"
import { Search, FileText, Download, Upload, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDocumentCache } from "@/hooks/use-document-cache"
import { isConvexAvailable } from "@/lib/convex-client"

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const { documents, hideDocument, exportCache, importCache } = useDocumentCache()
  const router = useRouter()

  const filteredDocuments = documents.filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          importCache(data)
        } catch (error) {
          console.error("Failed to import cache:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <aside className="w-80 min-h-full bg-base-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Documents</h2>
          {!isConvexAvailable() && <div className="badge badge-warning badge-xs">Local</div>}
        </div>

        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-300">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search documents..."
              className="input input-bordered flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline flex-1" onClick={exportCache}>
            <Download className="h-4 w-4" />
            Export
          </button>
          <label className="btn btn-sm btn-outline flex-1">
            <Upload className="h-4 w-4" />
            Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>

        <div className="divider">Recent Documents</div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredDocuments.length === 0 ? (
            <div className="text-center text-base-content/60 py-8">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No documents found</p>
              <p className="text-xs mt-1">
                {!isConvexAvailable() ? "Documents stored locally" : "Create or publish documents to see them here"}
              </p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/${doc.id}`)}
              >
                <div className="card-body p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{doc.title}</h3>
                      <p className="text-sm text-base-content/60">{new Date(doc.lastModified).toLocaleDateString()}</p>
                    </div>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        hideDocument(doc.id)
                      }}
                    >
                      <EyeOff className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}
