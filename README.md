# Markdown Scratchpad

A collaborative markdown editor built with Next.js, similar to Excalidraw but for markdown.

## Features

- **Local Editing**: Edit markdown at the root page (\`/\`) with localStorage only
- **Publishing**: Publish documents to unique URLs using 8-character nanoids
- **Real-time Collaboration**: Live editing on published documents (coming soon with Convex)
- **Theme Support**: Multiple DaisyUI themes with dark mode
- **Export/Import**: Backup and restore your document cache

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Setting up Convex (Optional)

For real-time collaboration, you'll need to set up Convex:

1. Install Convex CLI:
   \`\`\`bash
   npm install -g convex
   \`\`\`

2. Initialize Convex:
   \`\`\`bash
   npx convex dev
   \`\`\`

3. Follow the setup instructions and add your \`NEXT_PUBLIC_CONVEX_URL\` to your environment variables

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Editor**: Monaco Editor
- **Markdown**: react-markdown with syntax highlighting
- **Backend**: Convex (optional, falls back to localStorage)
- **Authentication**: Clerk.js (for admin features)

## Keyboard Shortcuts

- All Monaco editor shortcuts (Alt+Up/Down, multi-cursor, etc.)
