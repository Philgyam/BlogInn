import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { ArrowLeft, ArrowRight, BookOpenText, Clock3, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getPost } from '@/lib/appwrite'
import { formatRelativeDate } from '@/lib/search'
import type { PostDoc } from '@/types'

const STORY_TONES: Record<string, string> = {
  Technology: 'bg-[#2b3a67] text-white',
  DIY: 'bg-[#e8a33d] text-[#1b1a20]',
  Fashion: 'bg-[#f1ece3] text-[#2b3a67] dark:bg-[#2a3350] dark:text-[#f1ece3]',
  Health: 'bg-[#b4482b] text-white',
}

export default function LandingStory() {
  const { id } = useParams<{ id: string }>()
  const [story, setStory] = useState<PostDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    getPost(id)
      .then((post) => {
        if (active) setStory(post)
      })
      .catch(() => {
        if (active) setStory(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="mesh-bg min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="glass-shimmer h-10 w-40 rounded-full" />
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="glass-shimmer h-96 rounded-3xl" />
            <div className="glass-shimmer h-96 rounded-3xl" />
          </div>
        </div>
      </main>
    )
  }

  if (!story) {
    return (
      <main className="mesh-bg flex min-h-screen items-center justify-center bg-background p-4">
        <div className="glass max-w-md rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold">Story not found</h1>
          <p className="mt-2 text-muted-foreground">This room at the inn appears to be empty.</p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/#stories">Return to the stories</Link>
          </Button>
        </div>
      </main>
    )
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: story.Title, text: story.postDescribe, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Story link copied')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error('Could not share this story')
    }
  }

  const storyNumber = String(
    ['Technology', 'DIY', 'Fashion', 'Education', 'Health', 'Relationship'].indexOf(story.Category) + 1,
  ).padStart(2, '0')
  const readingMinutes = Math.max(
    1,
    Math.ceil(story.Content.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 220),
  )
  const sanitizedContent = DOMPurify.sanitize(story.Content)

  return (
    <div className="mesh-bg min-h-screen bg-background text-foreground">
      <header className="glass-nav sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpenText className="size-4" />
            </span>
            <span className="font-bold text-primary">BlogInn</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/signIn">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-7 flex items-center justify-between gap-3">
          <Button variant="ghost" className="rounded-full" asChild>
            <Link to="/#stories">
              <ArrowLeft className="size-4" />
              All four stories
            </Link>
          </Button>
          <Button variant="outline" className="glass rounded-full border-transparent" onClick={handleShare}>
            <Share2 className="size-4" />
            Share
          </Button>
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
          <div
            className={`relative flex min-h-72 overflow-hidden rounded-3xl p-6 sm:min-h-96 ${STORY_TONES[story.Category] || 'bg-primary text-primary-foreground'}`}
          >
            {story.postImage && (
              <img src={story.postImage} alt="" className="absolute inset-0 size-full object-cover opacity-25" />
            )}
            <span className="text-8xl font-black opacity-10 sm:text-9xl">{storyNumber}</span>
            <div className="absolute right-7 bottom-7 left-7">
              <p className="text-xs font-semibold opacity-70">{story.Category.toUpperCase()}</p>
              <p className="mt-2 text-2xl font-bold leading-tight">A story from the rooms at BlogInn.</p>
            </div>
          </div>

          <div className="glass flex flex-col justify-center rounded-3xl border-transparent p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
              <span>{story.Category.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock3 className="size-3" />
                {readingMinutes} min read
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">{story.Title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {story.postDescribe}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={story.Avatar} alt={story.Author} />
                <AvatarFallback>{story.Author.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{story.Author}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeDate(story.dateCreated)}</p>
              </div>
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-3xl py-10 sm:py-14">
          <div
            className="prose prose-neutral max-w-none prose-headings:font-bold prose-p:leading-8 prose-blockquote:border-[#e8a33d] dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          <aside className="glass mt-12 flex flex-col gap-5 rounded-3xl border-transparent p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-primary">YOUR TURN</p>
              <h2 className="mt-1 text-xl font-bold">Have a story only you can tell?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Come inside and make yourself at home.</p>
            </div>
            <Button asChild className="shrink-0 rounded-full">
              <Link to="/signUp">
                Start writing <ArrowRight className="size-4" />
              </Link>
            </Button>
          </aside>
        </article>
      </main>
    </div>
  )
}