import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { ArrowLeft, Clock3, MessageCircle, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CommentSection } from '@/components/CommentSection'
import { OtherPosts } from '@/components/OtherPosts'
import { FollowButton } from '@/components/FollowButton'
import { ReactionButtons } from '@/components/ReactionButtons'
import {
  createComment,
  getPost,
  listComments,
  listPostsByAuthor,
} from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { formatRelativeDate } from '@/lib/search'
import type { CommentDoc, PostDoc } from '@/types'

export default function FullPost() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { username, avatar } = useProfile()

  const [post, setPost] = useState<PostDoc | null>(null)
  const [otherPosts, setOtherPosts] = useState<PostDoc[]>([])
  const [comments, setComments] = useState<CommentDoc[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showFloatingComments, setShowFloatingComments] = useState(false)
  const [commentsInView, setCommentsInView] = useState(false)
  const commentsRef = useRef<HTMLDivElement>(null)

  const loadComments = useCallback(async (postId: string) => {
    const list = await listComments(postId)
    setComments(list)
  }, [])

  useEffect(() => {
    if (!id) return
    ;(async () => {
      setLoading(true)
      try {
        const fetched = await getPost(id)
        setPost(fetched)
        const [others] = await Promise.all([
          listPostsByAuthor(fetched.Author),
          loadComments(id),
        ])
        setOtherPosts(others)
      } catch (error) {
        toast.error('Post not found', {
          description: error instanceof Error ? error.message : undefined,
        })
      } finally {
        setLoading(false)
      }
    })()
  }, [id, loadComments])

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setReadingProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0)
      setShowFloatingComments(window.scrollY > 220)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [post?.$id])

  useEffect(() => {
    const commentsNode = commentsRef.current
    if (!commentsNode) return

    const observer = new IntersectionObserver(
      ([entry]) => setCommentsInView(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(commentsNode)
    return () => observer.disconnect()
  }, [post?.$id])

  const handleSubmitComment = async () => {
    if (!post || !user || !commentContent.trim()) return
    try {
      await createComment({
        author: username,
        postId: post.$id,
        userAvatar: avatar,
        content: commentContent.trim(),
        userId: user.$id,
      })
      setCommentContent('')
      await loadComments(post.$id)
    } catch (error) {
      toast.error("Couldn't post your comment", {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  const handleShare = async () => {
    if (!post) return
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.Title,
          text: post.postDescribe,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error('Could not share this story')
    }
  }

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => {
      commentsRef.current?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
    }, 450)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-5 p-6">
        <div className="glass-shimmer h-8 w-1/3 rounded-full" />
        <div className="glass-shimmer h-80 w-full rounded-3xl" />
        <div className="glass-shimmer h-5 w-full rounded-full" />
        <div className="glass-shimmer h-5 w-2/3 rounded-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="glass mx-auto my-12 flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 rounded-3xl border-dashed p-8 text-center">
        <p className="text-muted-foreground">This post doesn't exist (anymore).</p>
        <Button className="rounded-full" onClick={() => navigate('/home')}>
          <ArrowLeft className="size-4" />
          Back home
        </Button>
      </div>
    )
  }

  const sanitizedContent = DOMPurify.sanitize(post.Content)
  const readingMinutes = Math.max(1, Math.ceil(post.Content.split(/\s+/).length / 220))

  return (
    <div className="relative">
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-foreground/5">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="glass rounded-full"
            aria-label="Back to home"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="glass rounded-full border-transparent"
              onClick={scrollToComments}
            >
              <MessageCircle className="size-4" />
              Comments
              <span className="rounded-full bg-foreground/5 px-1.5 py-0.5 text-xs">
                {comments.length}
              </span>
            </Button>
          </div>
        </div>

        <header className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          {post.postImage && (
            <div className="glass w-full max-w-lg self-start overflow-hidden rounded-3xl border-transparent p-2 shadow-xl shadow-foreground/10">
              <img
                src={post.postImage}
                alt={post.Title}
                className="block h-auto w-full rounded-2xl"
              />
            </div>
          )}

          <div className={post.postImage ? 'pt-1' : 'md:col-span-2 md:mx-auto md:max-w-3xl'}>
            <div className="flex items-start justify-between gap-4">
              <h1 className="min-w-0 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {post.Title}
              </h1>
              <Badge variant="secondary" className="mt-1 shrink-0 rounded-full px-3 py-1">
                {post.Category}
              </Badge>
            </div>
            {post.postDescribe && (
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {post.postDescribe}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-11 ring-2 ring-white/50">
                  <AvatarImage src={post.Avatar} alt={post.Author} />
                  <AvatarFallback>{post.Author.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{post.Author}</p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatRelativeDate(post.dateCreated)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="size-3" />
                      {readingMinutes} min read
                    </span>
                  </p>
                </div>
              </div>
              <FollowButton targetProfileId={post.postID} />
            </div>
            <div className="glass mt-5 inline-flex items-center gap-3 rounded-full border-transparent px-4 py-2">
              <ReactionButtons post={post} onChange={setPost} />
              <div className="h-5 w-px bg-border" />
              <Button variant="ghost" size="sm" className="rounded-full" onClick={handleShare}>
                <Share2 className="size-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="min-w-0" data-reading-article>
            <div
              className="prose prose-neutral max-w-3xl prose-headings:font-bold prose-p:leading-8 prose-a:text-primary dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            <div ref={commentsRef} className="mt-8 max-w-3xl scroll-mt-6">
              <CommentSection
                comments={comments}
                commentContent={commentContent}
                onCommentContentChange={setCommentContent}
                onSubmit={handleSubmitComment}
                currentUsername={username}
                currentUserAvatar={avatar}
              />
            </div>
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <OtherPosts posts={otherPosts} author={post.Author} currentPostId={post.$id} />
          </aside>
        </div>
      </div>

      {showFloatingComments && !commentsInView && (
        <Button
          className="glass-strong fixed right-4 bottom-24 z-40 h-11 rounded-full border-transparent px-4 text-foreground shadow-xl animate-in fade-in slide-in-from-bottom-2 lg:right-6 lg:bottom-6"
          onClick={scrollToComments}
        >
          <MessageCircle className="size-4 text-primary" />
          <span>Comments</span>
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {comments.length}
          </span>
        </Button>
      )}
    </div>
  )
}
