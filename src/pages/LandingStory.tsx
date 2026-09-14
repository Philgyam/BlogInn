import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpenText, Clock3, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { findLandingStory } from '@/data/landing-stories'

const STORY_TONES: Record<string, string> = {
  Technology: 'bg-[#2b3a67] text-white',
  DIY: 'bg-[#e8a33d] text-[#1b1a20]',
  Fashion: 'bg-[#f1ece3] text-[#2b3a67] dark:bg-[#2a3350] dark:text-[#f1ece3]',
  Health: 'bg-[#b4482b] text-white',
}

export default function LandingStory() {
  const { slug } = useParams<{ slug: string }>()
  const story = findLandingStory(slug)

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
        await navigator.share({ title: story.title, text: story.excerpt, url: window.location.href })
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
    ['Technology', 'DIY', 'Fashion', 'Health'].indexOf(story.category) + 1,
  ).padStart(2, '0')

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
            className={`relative flex min-h-72 overflow-hidden rounded-3xl p-6 sm:min-h-96 ${STORY_TONES[story.category]}`}
          >
            <span className="text-8xl font-black opacity-10 sm:text-9xl">{storyNumber}</span>
            <div className="absolute right-7 bottom-7 left-7">
              <p className="text-xs font-semibold opacity-70">{story.category.toUpperCase()}</p>
              <p className="mt-2 text-2xl font-bold leading-tight">A story from the rooms at BlogInn.</p>
            </div>
          </div>

          <div className="glass flex flex-col justify-center rounded-3xl border-transparent p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
              <span>{story.category.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock3 className="size-3" />
                {story.readTime}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">{story.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {story.excerpt}
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-3xl py-10 sm:py-14">
          <p className="text-lg leading-8 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.9] first-letter:text-primary">
            {story.opening}
          </p>

          {story.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-2xl font-bold">{section.heading}</h2>
              <div className="mt-4 space-y-5">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-foreground/80 sm:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <p className="mt-10 border-l-4 border-[#e8a33d] pl-5 text-lg font-medium leading-8">
            {story.closing}
          </p>

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