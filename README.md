# Markdown Scratchpad

A collaborative markdown editor built with Next.js with no auth required!

## Features

- **Local Editing**: Edit a local document at the root page (`/`), only stored in localStorage only
- **Publishing**: Publish documents to unique URLs using nanoids
- **Real-time Collaboration**: Live editing on published documents

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Editor**: Monaco Editor
- **Markdown**: react-markdown with syntax highlighting
- **Realtime Backend**: Convex
- **Authentication**: Clerk.js (only for admin features)
