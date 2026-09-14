import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Archive, ArchiveRestore, MessageCircle, PenLine, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  deletePost,
  listCommentCounts,
  listPostsByUser,
  setArchived,
} from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { formatRelativeDate, truncateWords } from '@/lib/search'
import type { PostDoc } from '@/types'

export function UserPostList({ archived }: { archived: boolean }) {
  const { user } = useAuth()
  const { avatar } = useProfile()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostDoc[]>([])
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [userPosts, counts] = await Promise.all([
        listPostsByUser(user.$id, archived),
        listCommentCounts(),
      ])
      setPosts(userPosts)
      setCommentCounts(counts)
    } catch (error) {
      toast.error('Could not load posts', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setLoading(false)
    }
  }, [user, archived])

  useEffect(() => {
    load()
  }, [load])

  const handleArchiveToggle = async (post: PostDoc) => {
    try {
      await setArchived(post.$id, !archived)
      setPosts((prev) => prev.filter((p) => p.$id !== post.$id))
      toast.success(archived ? 'Post restored' : 'Post archived')
    } catch (error) {
      toast.error('Action failed', {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  const handleDelete = async () => {
    if (!pendingDeleteId) return
    try {
      await deletePost(pendingDeleteId)
      setPosts((prev) => prev.filter((p) => p.$id !== pendingDeleteId))
      toast.success('Post deleted')
    } catch (error) {
      toast.error('Could not delete post', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setPendingDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 lg:p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-shimmer h-40 rounded-3xl" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="glass mx-auto my-6 flex max-w-5xl flex-col items-center gap-4 rounded-3xl border-dashed p-12 text-center text-muted-foreground">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PenLine className="size-5" />
        </span>
        <p>
          {archived
            ? "You haven't archived any posts yet."
            : "You haven't written any posts yet."}
        </p>
        {!archived && (
          <Button asChild className="rounded-full px-5">
            <Link to="/addPost">Write your first post</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 lg:p-6">
        {posts.map((post) => (
          <Card
            key={post.$id}
            onClick={() =>
              navigate(`/post/${post.Author.trim()}/${post.Category.trim()}/${post.$id}`)
            }
            className="glass glass-interactive min-h-40 flex-row cursor-pointer overflow-hidden rounded-3xl border-transparent py-0"
          >
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={avatar} alt="You" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground">
                    {formatRelativeDate(post.dateCreated)}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full">{post.Category}</Badge>
              </div>
              <h3 className="text-lg font-bold">{truncateWords(post.Title, 12)}</h3>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {truncateWords(post.Content, 24)}
              </p>
              <div className="mt-auto flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MessageCircle className="size-3.5" />
                  {commentCounts[post.$id] || 0}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label={archived ? 'Restore post' : 'Archive post'}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleArchiveToggle(post)
                    }}
                  >
                    {archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete post"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPendingDeleteId(post.$id)
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
            {post.postImage && (
              <div className="hidden w-48 shrink-0 sm:block">
                <img src={post.postImage} alt="" className="size-full object-cover" />
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This can't be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
