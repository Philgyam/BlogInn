import type { PostDoc } from '@/types'

export function filterPosts(
  posts: PostDoc[],
  query: string,
  category: string | null,
): PostDoc[] {
  const q = query.trim().toLowerCase()

  return posts.filter((post) => {
    if (category && post.Category !== category) return false
    if (!q) return true

    return (
      post.Title.toLowerCase().includes(q) ||
      post.Content.toLowerCase().includes(q) ||
      post.Author.toLowerCase().includes(q) ||
      post.Category.toLowerCase().includes(q)
    )
  })
}

export function truncateWords(content: string, maxWords: number): string {
  const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = plain.split(' ')
  if (words.length <= maxWords) return plain
  return `${words.slice(0, maxWords).join(' ')}…`
}

export function formatRelativeDate(date: string): string {
  const target = new Date(date)
  const now = new Date()
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(target, now)) return 'Today'

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(target, yesterday)) return 'Yesterday'

  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
