import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { CommentDoc } from '@/types'

export function CommentSection({
  comments,
  commentContent,
  onCommentContentChange,
  onSubmit,
  currentUsername,
  currentUserAvatar,
}: {
  comments: CommentDoc[]
  commentContent: string
  onCommentContentChange: (value: string) => void
  onSubmit: () => void
  currentUsername: string
  currentUserAvatar: string
}) {
  const [posting, setPosting] = useState(false)

  const handleSubmit = async () => {
    if (!commentContent.trim() || posting) return
    setPosting(true)
    try {
      await onSubmit()
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="glass flex flex-col overflow-hidden rounded-3xl border-transparent">
      <div className="flex items-center justify-between border-b border-white/30 px-4 py-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-4 text-primary" />
          <h2 className="font-semibold">Comments</h2>
        </div>
        <span className="text-sm text-muted-foreground">{comments.length}</span>
      </div>

      <ScrollArea className="h-72">
        <div className="flex flex-col gap-3 p-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Be the first to comment.</p>
          ) : (
            comments.map((comment) => {
              const commentAuthor = comment.author?.trim() || 'Reader'
              const normalizedCurrentUsername = currentUsername?.trim().toLowerCase() || ''
              const isCurrentUser =
                normalizedCurrentUsername !== '' &&
                commentAuthor.toLowerCase() === normalizedCurrentUsername
              const avatarSrc = isCurrentUser ? currentUserAvatar : comment.userAvatar

              return (
                <div key={comment.$id} className="flex items-start gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={avatarSrc} alt={commentAuthor} />
                    <AvatarFallback>{commentAuthor.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 rounded-2xl bg-foreground/5 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{commentAuthor}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-2 border-t border-white/30 p-3">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={currentUserAvatar} alt={currentUsername || 'You'} />
          <AvatarFallback>{(currentUsername || 'You').slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Input
          value={commentContent}
          onChange={(e) => onCommentContentChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Add a comment…"
          className="glass h-10 rounded-full border-transparent"
        />
        <Button size="icon" className="rounded-full" onClick={handleSubmit} disabled={posting}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}
