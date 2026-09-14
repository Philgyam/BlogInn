import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UsersRound } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FollowButton } from '@/components/FollowButton'
import { listProfiles } from '@/lib/appwrite'
import { useProfile } from '@/context/ProfileContext'
import type { ProfileDoc } from '@/types'

export function SuggestedFollows() {
  const { profile } = useProfile()
  const [profiles, setProfiles] = useState<ProfileDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listProfiles()
      .then((all) =>
        setProfiles(
          all
            .filter((p) => p.profile_id !== profile?.profile_id && p.username)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5),
        ),
      )
      .finally(() => setLoading(false))
  }, [profile?.profile_id])

  if (loading || profiles.length === 0) return null

  return (
    <Card className="glass rounded-3xl border-transparent">
      <CardHeader className="flex flex-row items-center gap-3 px-5">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UsersRound className="size-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-primary">COMMUNITY</p>
          <CardTitle className="mt-1 text-lg">Writers to follow</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-2">
        {profiles.map((p) => (
          <div
            key={p.$id}
            className="flex items-center justify-between gap-3 rounded-2xl p-3 transition-colors hover:bg-foreground/5"
          >
            <Link
              to={`/community`}
              className="flex min-w-0 items-center gap-3"
            >
              <Avatar className="size-9">
                <AvatarImage src={p.UserAvatar} alt={p.username} />
                <AvatarFallback>{p.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm font-medium">{p.username}</span>
            </Link>
            <FollowButton targetProfileId={p.profile_id} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
