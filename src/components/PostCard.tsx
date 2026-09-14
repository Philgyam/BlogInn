import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Clock3, MessageCircle } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ReactionButtons } from '@/components/ReactionButtons'
import { formatRelativeDate, truncateWords } from '@/lib/search'
import { cn } from '@/lib/utils'
import type { PostDoc } from '@/types'

export function PostCard({
  post,
  authorAvatar,
  commentCount,
  layout = 'grid',
  featured = false,
  onReactionChange,
}: {
  post: PostDoc
  authorAvatar?: string
  commentCount: number
  layout?: 'grid' | 'list'
  featured?: boolean
  onReactionChange?: (post: PostDoc) => void
}) {
  const navigate = useNavigate()

  const goToPost = () => {
    navigate(`/post/${post.Author.trim()}/${post.Category.trim()}/${post.$id}`)
  }

  const avatarSrc = authorAvatar || post.Avatar
  const readingMinutes = Math.max(1, Math.ceil(post.Content.split(/\s+/).length / 220))

  return (
    <Card
      onClick={goToPost}
      className={cn(
        'glass glass-interactive group relative cursor-pointer overflow-hidden rounded-3xl border-transparent py-0',
        layout === 'list' && 'min-h-36 flex-row',
        featured && 'sm:col-span-2 md:grid md:min-h-80 md:grid-cols-[1.2fr_1fr] md:gap-0',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-muted',
          layout === 'grid' && !featured && 'aspect-4/3 w-full',
          layout === 'list' && 'h-auto min-h-full w-28 shrink-0 sm:w-48',
          featured && 'h-56 w-full md:h-full md:min-h-80',
        )}
      >
        {post.postImage && (
          <img
            src={post.postImage}
            alt={post.Title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <Badge
          className="glass-strong absolute bottom-3 left-3 border-transparent px-3 py-1 text-foreground"
          variant="secondary"
        >
          {post.Category}
        </Badge>
      </div>

      <div className={cn('flex flex-1 flex-col gap-4 p-5', featured && 'md:p-7')}>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={avatarSrc} alt={post.Author} />
            <AvatarFallback>{post.Author.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{post.Author}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatRelativeDate(post.dateCreated)}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock3 className="size-3" />
                {readingMinutes} min
              </span>
            </div>
          </div>
          <span className="ml-auto flex size-9 items-center justify-center rounded-full bg-foreground/5 text-foreground/60 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div>
          <h3 className={cn('line-clamp-2 text-lg font-bold leading-snug', featured && 'text-2xl')}>
            {post.Title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {truncateWords(post.Content, featured ? 34 : layout === 'grid' ? 22 : 16)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <ReactionButtons post={post} onChange={onReactionChange} size="sm" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle className="size-3.5" />
            {commentCount}
          </div>
        </div>
      </div>
    </Card>
  )
}
