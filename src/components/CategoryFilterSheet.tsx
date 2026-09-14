import { Compass } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CATEGORIES } from '@/types'
import { cn } from '@/lib/utils'

export function CategoryFilterSheet({
  category,
  onSelect,
}: {
  category: string | null
  onSelect: (category: string | null) => void
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Explore categories">
          <Compass />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Explore categories</SheetTitle>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 px-4">
          <Badge
            onClick={() => onSelect(null)}
            variant={category === null ? 'default' : 'outline'}
            className={cn('cursor-pointer px-3 py-1.5 text-sm')}
          >
            All categories
          </Badge>
          {CATEGORIES.map((c) => (
            <Badge
              key={c}
              onClick={() => onSelect(c)}
              variant={category === c ? 'default' : 'outline'}
              className={cn('cursor-pointer px-3 py-1.5 text-sm')}
            >
              {c}
            </Badge>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
