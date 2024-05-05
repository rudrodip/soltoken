import { ThemeProvider } from "@/components/theme/theme-provider"

export default function Proivders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}