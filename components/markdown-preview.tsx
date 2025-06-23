"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github.css"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="h-full overflow-y-auto p-6 bg-base-50">
      <div className="prose prose-lg max-w-none">
        {content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-base-content">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold mb-3 text-base-content">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold mb-2 text-base-content">{children}</h3>,
              h4: ({ children }) => <h4 className="text-lg font-bold mb-2 text-base-content">{children}</h4>,
              h5: ({ children }) => <h5 className="text-base font-bold mb-2 text-base-content">{children}</h5>,
              h6: ({ children }) => <h6 className="text-sm font-bold mb-2 text-base-content">{children}</h6>,
              p: ({ children }) => <p className="mb-4 text-base-content leading-relaxed">{children}</p>,
              code: ({ children, className }) => {
                const isInline = !className
                return isInline ? (
                  <code className="bg-base-200 px-1 py-0.5 rounded text-sm font-mono text-base-content">
                    {children}
                  </code>
                ) : (
                  <code className={className}>{children}</code>
                )
              },
              pre: ({ children }) => (
                <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm">{children}</pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-base-content/80">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1 text-base-content">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1 text-base-content">{children}</ol>
              ),
              li: ({ children }) => <li className="text-base-content">{children}</li>,
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="table table-zebra w-full">{children}</table>
                </div>
              ),
              th: ({ children }) => <th className="text-left font-semibold text-base-content">{children}</th>,
              td: ({ children }) => <td className="text-base-content">{children}</td>,
              a: ({ children, href }) => (
                <a href={href} className="link link-primary" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="font-bold text-base-content">{children}</strong>,
              em: ({ children }) => <em className="italic text-base-content">{children}</em>,
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <div className="text-center text-base-content/60 py-12">
            <p>Start typing to see your markdown preview...</p>
          </div>
        )}
      </div>
    </div>
  )
}
