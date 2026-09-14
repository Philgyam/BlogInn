import { Loader2 } from 'lucide-react'

export function Loader() {
  return (
    <div className="mesh-bg flex h-screen w-full items-center justify-center bg-transparent">
      <div className="glass-strong flex flex-col items-center gap-4 rounded-4xl px-10 py-8">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="text-sm font-medium text-foreground/70">Loading…</span>
      </div>
    </div>
  )
}
