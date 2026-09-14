import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenText,
  Heart,
  MessageCircle,
  PenLine,
  Sparkles,
  UsersRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LANDING_STORIES } from '@/data/landing-stories'
import { CATEGORIES } from '@/types'

const WRITER_ILLUSTRATION =
  'https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?semt=ais_hybrid&w=900'

const [technologyStory, diyStory, fashionStory, healthStory] = LANDING_STORIES

export default function Welcome() {
  return (
    <div className="mesh-bg min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden border-b border-white/40">
        <div className="absolute -top-20 right-[8%] h-48 w-36 rotate-12 rounded-3xl bg-[#e8a33d]/25" />
        <div className="absolute bottom-16 left-[42%] hidden h-40 w-28 -rotate-12 rounded-3xl bg-[#b4482b]/15 lg:block" />

        <header className="glass-strong absolute top-4 right-4 left-4 z-30 mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-3 py-2 sm:px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpenText className="size-4" />
            </span>
            <span className="text-lg font-bold text-primary">BlogInn</span>
          </Link>

          <nav className="flex items-center gap-1.5" aria-label="Account navigation">
            <ThemeToggle />
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/signIn">Sign in</Link>
            </Button>
            <Button className="hidden rounded-full sm:inline-flex" asChild>
              <Link to="/signUp">Join BlogInn</Link>
            </Button>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 px-5 pt-28 pb-8 sm:px-8 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[0.88fr_1.12fr] lg:gap-8 lg:px-12">
          <div className="relative z-20 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8a33d]/20 px-3 py-1.5 text-xs font-semibold text-[#7a4b00] dark:text-[#e8a33d]">
              <Sparkles className="size-3.5" />
              A cozy corner for curious minds
            </div>

            <h1 className="mt-5 text-5xl font-black leading-none text-primary sm:text-7xl lg:text-8xl">
              BlogInn
            </h1>
            <p className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
              Ideas check in.
              <br />
              Great stories stay.
            </p>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Write what moves you, discover people who think differently, and build a
              colorful little corner of the internet together.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 rounded-full px-6" asChild>
                <Link to="/signUp">
                  Start your story <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass h-12 rounded-full border-transparent px-6"
                asChild
              >
                <a href="#stories">Explore BlogInn</a>
              </Button>
            </div>

            <div className="mt-7 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2" aria-hidden="true">
                {['R', 'M', 'K'].map((letter, index) => (
                  <span
                    key={letter}
                    className="flex size-8 items-center justify-center rounded-full border-2 border-background text-xs font-bold text-white"
                    style={{ backgroundColor: ['#2b3a67', '#b4482b', '#e8a33d'][index] }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <span>Writers, readers, and wonderfully odd ideas.</span>
            </div>
          </div>

          <div className="landing-illustration relative mx-auto w-full">
            <div className="absolute right-4 bottom-2 aspect-square w-4/5 max-w-lg rotate-3 rounded-4xl bg-primary shadow-2xl shadow-primary/25" />
            <div className="glass-strong absolute right-8 bottom-0 z-10 aspect-square w-4/5 max-w-lg overflow-hidden rounded-4xl border-4 border-white/60 p-2">
              <img
                src={WRITER_ILLUSTRATION}
                alt="3D illustrated writer holding a camera"
                className="size-full rounded-3xl object-cover object-top"
              />
            </div>

            <div className="glass-strong absolute top-2 left-0 z-20 flex items-center gap-3 rounded-2xl px-4 py-3 sm:top-16">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#e8a33d] text-[#1b1a20]">
                <PenLine className="size-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Fresh from the desk</p>
                <p className="text-sm font-bold">A new story is brewing</p>
              </div>
            </div>

            <div className="absolute top-28 right-0 z-20 rotate-3 rounded-2xl bg-[#e8a33d] px-4 py-3 text-[#1b1a20] shadow-xl sm:top-24">
              <Sparkles className="mb-2 size-5" />
              <p className="text-xs font-semibold">DAILY SPARK</p>
              <p className="mt-1 max-w-28 text-sm font-bold leading-5">
                Write the thing only you can tell.
              </p>
            </div>

            <div className="glass-strong absolute bottom-8 left-0 z-20 flex items-center gap-3 rounded-2xl px-4 py-3 sm:left-3">
              <div className="flex -space-x-2">
                <span className="flex size-8 items-center justify-center rounded-full border-2 border-white/60 bg-[#2b3a67] text-xs font-bold text-white">A</span>
                <span className="flex size-8 items-center justify-center rounded-full border-2 border-white/60 bg-[#b4482b] text-xs font-bold text-white">J</span>
              </div>
              <div>
                <p className="flex items-center gap-1 text-sm font-bold">
                  <UsersRound className="size-3.5 text-primary" /> 2.4k readers
                </p>
                <p className="text-xs text-muted-foreground">finding their next favorite</p>
              </div>
            </div>

            <div className="absolute right-1 bottom-5 z-20 flex items-center gap-2 rounded-full bg-[#b4482b] px-4 py-2.5 text-white shadow-xl sm:right-3 sm:bottom-16">
              <Heart className="size-4 fill-current" />
              <span className="text-sm font-semibold">Made with feeling</span>
              <MessageCircle className="size-4" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="shrink-0 text-xs font-semibold text-primary">PICK YOUR NEXT CHAPTER</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category, index) => (
              <span
                key={category}
                className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-sm font-medium"
                style={{ color: index % 3 === 0 ? '#2b3a67' : index % 3 === 1 ? '#b4482b' : '#8a5b0d' }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="stories"
        className="scroll-mt-4 border-t border-white/40 bg-[#e7e0d2]/70 px-5 py-16 dark:bg-[#1f1e26]/70 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-primary">FOUR STORIES TO START</p>
              <h2 className="mt-2 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                A little something for every curious mind.
              </h2>
            </div>
            <Button variant="ghost" className="self-start rounded-full sm:self-auto" asChild>
              <Link to="/signUp">
                Read more inside <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to={`/stories/${technologyStory.slug}`}
              className="group relative flex min-h-80 flex-col overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:col-span-2 lg:row-span-2"
            >
              <div className="absolute -right-10 -bottom-12 h-56 w-44 rotate-12 rounded-3xl bg-[#3b4e86]" />
              <div className="absolute right-10 bottom-8 h-48 w-36 rotate-6 rounded-2xl bg-[#f1ece3] shadow-xl">
                <div className="space-y-3 p-5">
                  <span className="block h-2 w-16 rounded-full bg-[#e8a33d]" />
                  <span className="block h-2 w-full rounded-full bg-[#2b3a67]/20" />
                  <span className="block h-2 w-4/5 rounded-full bg-[#2b3a67]/20" />
                  <span className="block h-2 w-3/5 rounded-full bg-[#2b3a67]/20" />
                </div>
              </div>

              <span className="relative flex size-11 items-center justify-center rounded-2xl bg-white/10">
                <BookOpenText className="size-5" />
              </span>
              <div className="relative mt-auto max-w-sm pr-20 sm:pr-28">
                <p className="text-xs font-semibold text-[#e8a33d]">
                  {technologyStory.category.toUpperCase()} · {technologyStory.readTime.toUpperCase()}
                </p>
                <h3 className="mt-2 text-2xl font-bold leading-tight">
                  {technologyStory.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/70">
                  {technologyStory.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#e8a33d]">
                  Read story <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link
              to={`/stories/${diyStory.slug}`}
              className="group relative flex min-h-44 flex-col overflow-hidden rounded-3xl bg-[#e8a33d] p-6 text-[#1b1a20] sm:col-span-2"
            >
              <Sparkles className="absolute top-5 right-6 size-10 text-[#1b1a20]/15" />
              <p className="text-xs font-semibold">
                {diyStory.category.toUpperCase()} · {diyStory.readTime.toUpperCase()}
              </p>
              <h3 className="mt-3 max-w-xl text-xl font-bold leading-snug sm:text-2xl">
                {diyStory.title}
              </h3>
              <p className="mt-auto max-w-xl text-sm leading-6 text-[#1b1a20]/70">
                {diyStory.excerpt}
              </p>
              <ArrowRight className="absolute right-6 bottom-6 size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to={`/stories/${fashionStory.slug}`}
              className="glass glass-interactive group flex min-h-44 flex-col rounded-3xl border-transparent p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PenLine className="size-4" />
              </span>
              <div className="mt-auto">
                <p className="text-xs font-semibold text-primary">
                  {fashionStory.category.toUpperCase()} · {fashionStory.readTime.toUpperCase()}
                </p>
                <h3 className="mt-1 text-lg font-bold">{fashionStory.title}</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">
                  {fashionStory.excerpt}
                </p>
              </div>
            </Link>

            <Link
              to={`/stories/${healthStory.slug}`}
              className="group relative flex min-h-44 flex-col overflow-hidden rounded-3xl bg-[#b4482b] p-5 text-white"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-white/15">
                  <Heart className="size-4" />
                </span>
                <Sparkles className="size-7 text-[#e8a33d]" />
              </div>
              <div className="mt-auto">
                <p className="text-xs font-semibold text-[#f4c981]">
                  {healthStory.category.toUpperCase()} · {healthStory.readTime.toUpperCase()}
                </p>
                <h3 className="mt-1 text-lg font-bold">{healthStory.title}</h3>
                <p className="mt-2 text-sm leading-5 text-white/70">
                  {healthStory.excerpt}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}