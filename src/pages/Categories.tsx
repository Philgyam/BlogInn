import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useProfile } from '@/context/ProfileContext'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/types'

export default function Categories() {
  const navigate = useNavigate()
  const { profile, saveProfile } = useProfile()
  const [selected, setSelected] = useState<string[]>(profile?.interests ?? [])
  const [saving, setSaving] = useState(false)

  const toggle = (category: string) => {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleNext = async () => {
    setSaving(true)
    try {
      await saveProfile({ interests: selected })
      navigate('/home')
    } catch (error) {
      toast.error('Could not save your interests', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-linear-to-br from-[#2b3a67] via-[#1f1e26] to-[#b4482b] px-6 py-16 text-white">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Choose your <span className="text-[#e8a33d]">interests</span>
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => toggle(category)}
              className={cn(
                'rounded-2xl px-6 py-3 text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]',
                selected.includes(category)
                  ? 'bg-[#e8a33d] text-[#1b1a20]'
                  : 'bg-white/10 backdrop-blur-md hover:bg-white/20',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button size="lg" variant="secondary" onClick={handleNext} disabled={saving}>
            {saving && <Loader2 className="animate-spin" />}
            Continue
          </Button>
          {selected.length === 0 && (
            <p className="text-sm text-white/70">
              Pick a few, or skip — you can always change these later.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
