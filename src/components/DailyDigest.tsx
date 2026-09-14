import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeDate } from '@/lib/search'
import type { PostDoc } from '@/types'

export function DailyDigest({
  posts,
  avatars,
}: {
  posts: PostDoc[]
  avatars: Record<string, string>
}) {
  const navigate = useNavigate()

  const picks = useMemo(() => {
    // Deterministic pseudo-shuffle (stable per post id) instead of Math.random,
    // so this stays a pure function of `posts`.
    const hash = (id: string) =>
      id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return [...posts].sort((a, b) => hash(a.$id) - hash(b.$id)).slice(0, 3)
  }, [posts])

  if (picks.length === 0) return null

  return (
    <Card className="glass overflow-hidden rounded-3xl border-transparent py-0">
      <CardHeader className="flex flex-row items-center justify-between px-5 pt-5">
        <div>
          <p className="text-xs font-semibold text-primary">EDITOR&apos;S PICK</p>
          <CardTitle className="mt-1 text-lg">Daily Digest</CardTitle>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-[#e8a33d]/20 text-[#b4482b] dark:text-[#e8a33d]">
          <Sparkles className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-2 pb-2">
        {picks.map((post, index) => (
          <button
            key={post.$id}
            onClick={() =>
              navigate(`/post/${post.Author.trim()}/${post.Category.trim()}/${post.$id}`)
            }
            className="group flex items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-foreground/5"
          >
            <span className="text-xs font-semibold text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            {post.postImage ? (
              <img
                src={post.postImage}
                alt=""
                loading="lazy"
                className="size-12 rounded-xl object-cover"
              />
            ) : (
              <Avatar className="size-12 rounded-xl">
                <AvatarImage src={avatars[post.postID] || post.Avatar} alt={post.Author} />
                <AvatarFallback>{post.Author.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{post.Title}</p>
              <p className="text-xs text-muted-foreground">
                {post.Author} · {formatRelativeDate(post.dateCreated)}
              </p>
            </div>
            <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
