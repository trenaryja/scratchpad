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

## TODO:

- [ ] Copy paste button in code blocks
  - [ ] use-debounce-cycle for copying as code-block
- [ ] Injectable style sheets?
- [ ] Theme Picker
- [ ] Known Links documentation
- [ ] Syntax highlighting
- [ ] TipTap integration
- [ ] embeddable links?
- [ ] ?raw param to get raw content
- [ ] mermaid diagram render support
- [ ] mermaid diagram syntax highlighting
- [ ] md.trenary.dev/mermaid
  - endpoint for turning markdown text input into mermaid html.
  - sanitize input and churn it back
