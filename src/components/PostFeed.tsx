import { Link } from 'react-router-dom'
import { ArrowUpRight, PenLine } from 'lucide-react'

import { PostCard } from '@/components/PostCard'
import { DailyDigest } from '@/components/DailyDigest'
import { SuggestedFollows } from '@/components/SuggestedFollows'
import { usePostFeed, type FeedMode } from '@/hooks/use-post-feed'
import { filterPosts } from '@/lib/search'
import { cn } from '@/lib/utils'

export function PostFeed({
  mode,
  search,
  category,
  layout,
}: {
  mode: FeedMode
  search: string
  category: string | null
  layout: 'grid' | 'list'
}) {
  const { posts, avatars, commentCounts, loading, updatePost } = usePostFeed(mode)
  const filtered = filterPosts(posts, search, category)

  const feedTitle =
    mode === 'recent' ? 'Latest stories' : mode === 'forYou' ? 'Picked for you' : 'Trending now'

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="min-w-0" aria-label={feedTitle}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary">STORIES</p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl">{feedTitle}</h2>
          </div>
          {!loading && (
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
            </span>
          )}
        </div>

        {loading ? (
          <FeedSkeleton layout={layout} />
        ) : filtered.length === 0 ? (
          <div className="glass rounded-3xl border-dashed p-12 text-center text-muted-foreground">
            {posts.length === 0 ? 'No posts yet — be the first to write one.' : 'No posts match your search.'}
          </div>
        ) : (
          <div
            className={cn(
              layout === 'grid'
                ? 'grid grid-cols-1 gap-5 sm:grid-cols-2'
                : 'flex flex-col gap-4',
            )}
          >
            {filtered.map((post, index) => (
              <PostCard
                key={post.$id}
                post={post}
                authorAvatar={avatars[post.postID]}
                commentCount={commentCounts[post.$id] || 0}
                layout={layout}
                featured={layout === 'grid' && index === 0}
                onReactionChange={updatePost}
              />
            ))}
          </div>
        )}
      </section>

      <aside className="flex w-full min-w-0 flex-col gap-5 lg:sticky lg:top-36 lg:self-start">
        <DailyDigest posts={posts} avatars={avatars} />
        <Link
          to="/addPost"
          className="glass glass-interactive group overflow-hidden rounded-3xl p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <PenLine className="size-4" />
            </span>
            <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </div>
          <p className="mt-5 text-xs font-semibold text-primary">YOUR TURN</p>
          <h3 className="mt-1 text-lg font-bold">Start a new story</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Bring an idea to the community while it is still fresh.
          </p>
        </Link>
        <SuggestedFollows />
      </aside>
    </div>
  )
}

function FeedSkeleton({ layout }: { layout: 'grid' | 'list' }) {
  return (
    <div
      className={cn(
        layout === 'grid'
          ? 'grid grid-cols-1 gap-5 sm:grid-cols-2'
          : 'flex flex-col gap-4',
      )}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'glass-shimmer rounded-3xl',
            layout === 'grid' ? 'h-80' : 'h-36',
          )}
        />
      ))}
    </div>
  )
}
