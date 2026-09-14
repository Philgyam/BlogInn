import { useState } from 'react'
import { LayoutGrid, List, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryFilterSheet } from '@/components/CategoryFilterSheet'
import { PostFeed } from '@/components/PostFeed'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { FeedMode } from '@/hooks/use-post-feed'

const TABS: { value: FeedMode; label: string }[] = [
  { value: 'recent', label: 'Recent' },
  { value: 'forYou', label: 'For You' },
  { value: 'trending', label: 'Trending' },
]

export default function Homepage() {
  const [mode, setMode] = useState<FeedMode>('recent')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const debouncedSearch = useDebouncedValue(search)

  return (
    <div className="flex flex-col">
      <header className="glass-nav sticky top-[65px] z-20 border-b lg:top-0">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary">THE DAILY EDIT</p>
              <h1 className="text-2xl font-bold sm:text-3xl">Discover</h1>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2 md:max-w-xl">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories, writers, topics"
                  className="glass h-11 rounded-full border-transparent pl-10 shadow-none"
                />
              </div>
              <CategoryFilterSheet category={category} onSelect={setCategory} />
              <Button
                variant="outline"
                size="icon"
                aria-label={layout === 'grid' ? 'Show list view' : 'Show grid view'}
                className="glass size-11 rounded-full border-transparent"
                onClick={() =>
                  setLayout((current) => (current === 'grid' ? 'list' : 'grid'))
                }
              >
                {layout === 'grid' ? <List /> : <LayoutGrid />}
              </Button>
            </div>
          </div>

          <Tabs value={mode} onValueChange={(value) => setMode(value as FeedMode)}>
            <TabsList className="w-full sm:w-fit">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <PostFeed mode={mode} search={debouncedSearch} category={category} layout={layout} />
    </div>
  )
}
