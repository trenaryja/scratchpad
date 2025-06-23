# Convex Setup Instructions

## Quick Start (Local Mode)

The app works immediately in local mode using localStorage. You'll see "Local Mode" badges in the UI.

## Enable Real-time Collaboration with Convex

### 1. Install Convex CLI

```bash
pnpm install -g convex
```

### 2. Initialize Convex

```bash
pnpm dlx convex dev
```

### 3. Follow the setup wizard

- Create a new Convex project or connect to existing
- This will generate the `convex/_generated/` files
- Add your `NEXT_PUBLIC_CONVEX_URL` to `.env.local`

### 4. Deploy your schema

```bash
pnpm dlx convex deploy
```

### 5. Restart your Next.js app

```bash
pnpm run dev
```

The app will automatically detect Convex availability and switch to real-time mode!

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
```
