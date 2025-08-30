import { Sparkles } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
      <span className="text-base font-semibold tracking-tight text-foreground">GreenSpark</span>
    </div>
  )
}
