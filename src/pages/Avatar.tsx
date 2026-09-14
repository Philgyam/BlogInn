import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadImage } from '@/lib/appwrite'
import { AVATAR_SUGGESTIONS } from '@/lib/avatar-suggestions'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { cn } from '@/lib/utils'

export default function Avatar() {
  const { user } = useAuth()
  const { avatar, saveProfile } = useProfile()
  const navigate = useNavigate()

  const [selectedAvatar, setSelectedAvatar] = useState(
    avatar || AVATAR_SUGGESTIONS[0].src,
  )
  const [bio, setBio] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setSelectedAvatar(url)
    } catch (error) {
      toast.error('Could not upload image', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setUploading(false)
    }
  }

  const handleNext = async () => {
    if (!user) return
    setSaving(true)
    try {
      await saveProfile({
        username: user.name,
        UserAvatar: selectedAvatar,
        UserDescription: bio,
      })
      navigate('/categories')
    } catch (error) {
      toast.error('Could not save your profile', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-linear-to-br from-[#2b3a67] via-[#1f1e26] to-[#b4482b] px-6 py-16 text-white">
      <div className="text-center">
        <p className="text-lg text-white/80">Welcome,</p>
        <h1 className="text-4xl font-bold">{user?.name}</h1>
      </div>

      <div className="size-32 overflow-hidden rounded-full border-4 border-white/50 shadow-xl">
        {selectedAvatar ? (
          <img src={selectedAvatar} alt="Selected avatar" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-white/10 text-3xl font-semibold">
            {user?.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="mb-3 text-sm font-medium text-white/80">Choose a suggested look</p>
        <div className="flex max-w-md flex-wrap justify-center gap-3">
        {AVATAR_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            aria-label={`Use ${suggestion.label} avatar`}
            aria-pressed={selectedAvatar === suggestion.src}
            onClick={() => setSelectedAvatar(suggestion.src)}
            className={cn(
              'relative size-16 overflow-hidden rounded-full border-2 transition-all hover:scale-105',
              selectedAvatar === suggestion.src
                ? 'border-[#e8a33d] opacity-100 ring-4 ring-[#e8a33d]/20'
                : 'border-white/20 opacity-75 hover:opacity-100',
            )}
          >
            <img src={suggestion.src} alt={suggestion.label} className="size-full object-cover" />
            {selectedAvatar === suggestion.src && (
              <span className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full bg-[#e8a33d] text-[#1b1a20]">
                <Check className="size-3" />
              </span>
            )}
          </button>
        ))}
        </div>
      </div>

      <label>
        <Button variant="secondary" asChild disabled={uploading}>
          <span className="cursor-pointer">
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            Upload your own
          </span>
        </Button>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      <Input
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Say something nice about yourself 😊"
        className="max-w-sm border-white/30 bg-black/20 text-white placeholder:text-white/60"
      />

      <Button size="lg" variant="secondary" disabled={saving} onClick={handleNext}>
        {saving && <Loader2 className="animate-spin" />}
        Next
      </Button>
    </div>
  )
}
