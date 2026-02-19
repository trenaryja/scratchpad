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

### Features:

- [ ] Copy paste button in code blocks
  - [ ] use-debounce-cycle for copying as code-block
- [ ] Injectable style sheets?
- [ ] Theme Picker
- [ ] Known Links documentation
- [ ] Syntax highlighting
  - [ ] highlightjs or robsehype, then maybe shiki, then maybe custom/daisy
  - [ ] backtick function like prisma.$queryRaw that syntax highlights a string of markdown
    - [ ] returns rendered html
    - [ ] used in a custom markdown component
    - [ ] allow middleware?
    - [ ] nested code fences?
- [ ] TipTap integration
  - [ ] add classnames to tiptap
- [ ] embeddable links?
- [ ] ?raw param to get raw content
- [ ] mermaid diagram render support
- [ ] mermaid diagram syntax highlighting
- [ ] md.trenary.dev/mermaid
  - endpoint for turning markdown text input into mermaid html.
  - sanitize input and return html as a response
- [ ] infisical management
- [ ] update tabTitle for local document on load

### Bugs:

- [ ] Observerving users are getting constantly rerendered flashing content
- [ ] Fix width of view mode
- [ ] Read only mode shows editor
