import { useEffect, useState } from 'react'
import { Check, ImagePlus, Loader2, Save, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useProfile } from '@/context/ProfileContext'
import { uploadImage } from '@/lib/appwrite'
import { AVATAR_SUGGESTIONS } from '@/lib/avatar-suggestions'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/types'

export default function UserBio() {
  const { profile, username, avatar, saveProfile } = useProfile()
  const [draftUsername, setDraftUsername] = useState(username)
  const [bio, setBio] = useState(profile?.UserDescription ?? '')
  const [selectedAvatar, setSelectedAvatar] = useState(avatar)
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraftUsername(username)
    setBio(profile?.UserDescription ?? '')
    setSelectedAvatar(avatar)
    setInterests(profile?.interests ?? [])
  }, [avatar, profile?.UserDescription, profile?.interests, username])

  const resetDraft = () => {
    setDraftUsername(username)
    setBio(profile?.UserDescription ?? '')
    setSelectedAvatar(avatar)
    setInterests(profile?.interests ?? [])
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      setSelectedAvatar(imageUrl)
      toast.success('Photo ready', { description: 'Save your changes to update the profile.' })
    } catch (error) {
      toast.error('Could not upload photo', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    )
  }

  const handleSave = async () => {
    const cleanUsername = draftUsername.trim()
    if (!cleanUsername) {
      toast.error('Display name is required')
      return
    }

    setSaving(true)
    try {
      await saveProfile({
        username: cleanUsername,
        UserDescription: bio.trim(),
        UserAvatar: selectedAvatar,
        interests,
      })
      toast.success('Profile updated')
    } catch (error) {
      toast.error('Could not update profile', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="glass mx-auto my-6 grid max-w-5xl overflow-hidden rounded-3xl border-transparent lg:grid-cols-[19rem_minmax(0,1fr)]">
      <aside className="flex flex-col items-center border-b border-white/30 p-6 text-center lg:border-r lg:border-b-0">
        <p className="text-xs font-semibold text-primary">YOUR LOOK</p>
        <h2 className="mt-1 text-xl font-bold">Profile picture</h2>

        <Avatar className="mt-6 size-32 ring-4 ring-white/50 shadow-xl">
          <AvatarImage src={selectedAvatar} alt={draftUsername || username} />
          <AvatarFallback className="text-3xl font-semibold">
            {(draftUsername || username || 'You').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="mt-7 w-full">
          <p className="mb-3 text-left text-xs font-semibold text-muted-foreground">
            SUGGESTED LOOKS
          </p>
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                aria-label={`Use ${suggestion.label} avatar`}
                aria-pressed={selectedAvatar === suggestion.src}
                onClick={() => setSelectedAvatar(suggestion.src)}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-2xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md',
                  selectedAvatar === suggestion.src
                    ? 'border-primary ring-4 ring-primary/10'
                    : 'border-transparent opacity-75 hover:opacity-100',
                )}
              >
                <img src={suggestion.src} alt={suggestion.label} className="size-full object-cover" />
                {selectedAvatar === suggestion.src && (
                  <span className="absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-5 w-full">
          <Button variant="outline" className="glass w-full rounded-full border-transparent" asChild disabled={uploading}>
            <span className="cursor-pointer">
              {uploading ? <Loader2 className="animate-spin" /> : <Upload className="size-4" />}
              Upload your own
            </span>
          </Button>
          <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
        </label>
      </aside>

      <div className="p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ImagePlus className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-primary">PROFILE DETAILS</p>
            <h2 className="text-xl font-bold">Make it yours</h2>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Display name</Label>
            <Input
              id="profile-name"
              value={draftUsername}
              onChange={(event) => setDraftUsername(event.target.value)}
              maxLength={80}
              placeholder="How should readers know you?"
              className="glass h-11 rounded-2xl border-transparent"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="profile-bio">Bio</Label>
              <span className="text-xs text-muted-foreground">{bio.length}/280</span>
            </div>
            <Textarea
              id="profile-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={280}
              placeholder="Tell readers what you notice, make, or care about."
              className="glass min-h-32 rounded-2xl border-transparent p-4 leading-6"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Interests</legend>
            <p className="mt-1 text-xs text-muted-foreground">
              These help shape your For You feed.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((interest) => {
                const selected = interests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-sm font-medium transition-colors',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background/40 text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    {selected && <Check className="mr-1 inline size-3.5" />}
                    {interest}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-2 border-t border-white/30 pt-5 sm:flex-row sm:justify-end">
          <Button variant="ghost" className="rounded-full" onClick={resetDraft} disabled={saving || uploading}>
            Reset
          </Button>
          <Button className="rounded-full px-5" onClick={handleSave} disabled={saving || uploading}>
            {saving ? <Loader2 className="animate-spin" /> : <Save className="size-4" />}
            Save changes
          </Button>
        </div>
      </div>
    </section>
  )
}
