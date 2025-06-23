"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      themes={["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro"]}
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
