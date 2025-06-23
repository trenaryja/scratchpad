"use client"
import { AppLayout } from "@/components/app-layout"
import { EditorView } from "@/components/editor-view"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function HomePage() {
  const [content, setContent, contentLoaded] = useLocalStorage("scratchpad-content", "")
  const [title, setTitle, titleLoaded] = useLocalStorage("scratchpad-title", "Untitled")

  // Don't render until localStorage is loaded to prevent hydration mismatch
  if (!contentLoaded || !titleLoaded) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <EditorView
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        isLocal={true}
      />
    </AppLayout>
  )
}
