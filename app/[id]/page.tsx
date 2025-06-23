"use client"
import { useParams } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { EditorView } from "@/components/editor-view"
import { useConvexDocument } from "@/hooks/use-convex-document"

export default function DocumentPage() {
  const params = useParams()
  const id = params.id as string

  // Validate nanoid format (8 characters, alphanumeric)
  const isValidId = /^[a-zA-Z0-9]{8}$/.test(id)

  const { document, updateDocument, isLoading, isUsingConvex } = useConvexDocument(id)

  if (!isValidId) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Invalid Document ID</h1>
            <p className="text-base-content/60">The document ID must be 8 characters long.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4 text-base-content/60">
              Loading document...
              {!isUsingConvex && <span className="block text-sm text-warning">Running in local mode</span>}
            </p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <EditorView
        title={document?.title || "Untitled Document"}
        content={document?.content || ""}
        onTitleChange={(title) => updateDocument({ title })}
        onContentChange={(content) => updateDocument({ content })}
        isLocal={false}
        documentId={id}
      />
    </AppLayout>
  )
}
