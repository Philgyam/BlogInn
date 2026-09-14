import { useEffect, useState } from 'react'
import { Search, UsersRound } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FollowButton } from '@/components/FollowButton'
import { listProfiles } from '@/lib/appwrite'
import { useProfile } from '@/context/ProfileContext'
import type { ProfileDoc } from '@/types'

export default function Community() {
  const { profile } = useProfile()
  const [profiles, setProfiles] = useState<ProfileDoc[]>([])
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const all = await listProfiles()
        const withUsername = all.filter(
          (candidate) => candidate.username && candidate.profile_id !== profile?.profile_id,
        )
        const counts = Object.fromEntries(
          withUsername.map((candidate) => [candidate.profile_id, 0]),
        )
        for (const candidate of all) {
          for (const followedId of candidate.following ?? []) {
            if (followedId in counts) counts[followedId] += 1
          }
        }
        setProfiles(withUsername)
        setFollowerCounts(counts)
      } finally {
        setLoading(false)
      }
    })()
  }, [profile?.profile_id])

  const query = search.trim().toLowerCase()
  const filtered = profiles.filter((candidate) =>
    [candidate.username, candidate.UserDescription, ...(candidate.interests ?? [])]
      .join(' ')
      .toLowerCase()
      .includes(query),
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-primary">COMMUNITY</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Meet the writers</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {profiles.length} {profiles.length === 1 ? 'voice' : 'voices'} in your community
          </p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search writers or interests"
            className="glass h-11 rounded-full border-transparent pl-10"
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-shimmer h-56 rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-3xl border-dashed p-12 text-center">
          <UsersRound className="size-6 text-primary" />
          <p className="font-medium">
            {profiles.length === 0 ? 'No other writers are here yet.' : 'No writers match your search.'}
          </p>
          <p className="text-sm text-muted-foreground">
            {profiles.length === 0
              ? 'New community members will appear here.'
              : 'Try another name, topic, or interest.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((candidate) => (
            <Card
              key={candidate.$id}
              className="glass glass-interactive min-h-56 rounded-3xl border-transparent"
            >
              <CardContent className="flex h-full flex-col gap-5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <Avatar className="size-14 ring-2 ring-white/50">
                    <AvatarImage src={candidate.UserAvatar} alt={candidate.username} />
                    <AvatarFallback>{candidate.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <FollowButton targetProfileId={candidate.profile_id} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{candidate.username}</p>
                  <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                    {candidate.UserDescription || 'Sharing stories with the BlogInn community.'}
                  </p>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap gap-1.5">
                    {(candidate.interests ?? []).slice(0, 2).map((interest) => (
                      <Badge key={interest} variant="secondary" className="rounded-full text-[11px]">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {followerCounts[candidate.profile_id] ?? 0}{' '}
                    {(followerCounts[candidate.profile_id] ?? 0) === 1 ? 'follower' : 'followers'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
