import { useState } from 'react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { toggleReaction } from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import type { PostDoc } from '@/types'

export function ReactionButtons({
  post,
  onChange,
  size = 'default',
}: {
  post: PostDoc
  onChange?: (post: PostDoc) => void
  size?: 'default' | 'sm'
}) {
  const { user } = useAuth()
  const [pending, setPending] = useState(false)

  const likes = post.likes ?? []
  const dislikes = post.dislikes ?? []
  const liked = user ? likes.includes(user.$id) : false
  const disliked = user ? dislikes.includes(user.$id) : false

  const react = async (reaction: 'likes' | 'dislikes') => {
    if (!user || pending) return
    setPending(true)
    try {
      const updated = await toggleReaction(post, user.$id, reaction)
      onChange?.(updated)
    } catch (error) {
      toast.error("Couldn't save your reaction", {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setPending(false)
    }
  }

  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4'

  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          react('likes')
        }}
        className={cn(
          'flex items-center gap-1.5 transition-colors hover:text-primary',
          liked && 'text-primary',
        )}
      >
        <ThumbsUp className={iconSize} />
        <span className="text-xs">{likes.length}</span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          react('dislikes')
        }}
        className={cn(
          'flex items-center gap-1.5 transition-colors hover:text-destructive',
          disliked && 'text-destructive',
        )}
      >
        <ThumbsDown className={iconSize} />
        <span className="text-xs">{dislikes.length}</span>
      </button>
    </div>
  )
}
