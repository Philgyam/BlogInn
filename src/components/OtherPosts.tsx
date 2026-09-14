import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { truncateWords } from '@/lib/search'
import type { PostDoc } from '@/types'

export function OtherPosts({
  posts,
  author,
  currentPostId,
}: {
  posts: PostDoc[]
  author: string
  currentPostId: string
}) {
  const navigate = useNavigate()
  const others = posts.filter((p) => p.$id !== currentPostId)

  return (
    <div>
      <p className="text-xs font-semibold text-primary">KEEP READING</p>
      <h2 className="mt-1 mb-4 text-lg font-bold">More from {author}</h2>
      {others.length === 0 ? (
        <p className="text-sm text-muted-foreground">No other posts yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {others.map((post) => (
            <Card
              key={post.$id}
              onClick={() =>
                navigate(`/post/${post.Author.trim()}/${post.Category.trim()}/${post.$id}`)
              }
              className="glass glass-interactive group flex-row cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border-transparent p-3"
            >
              {post.postImage && (
                <img
                  src={post.postImage}
                  alt=""
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0">
                <h3 className="truncate font-medium">{post.Title}</h3>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {truncateWords(post.Content, 16)}
                </p>
              </div>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
