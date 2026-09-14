import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { toggleFollow } from '@/lib/appwrite'
import { useProfile } from '@/context/ProfileContext'
import { cn } from '@/lib/utils'

export function FollowButton({
  targetProfileId,
  className,
}: {
  targetProfileId: string
  className?: string
}) {
  const { profile, refreshProfile } = useProfile()
  const [pending, setPending] = useState(false)

  const isFollowing = profile?.following?.includes(targetProfileId) ?? false
  const isSelf = profile?.profile_id === targetProfileId

  if (isSelf) return null

  const handleClick = async () => {
    if (!profile) {
      toast.error('Finish setting up your profile first')
      return
    }
    setPending(true)
    try {
      await toggleFollow(profile, targetProfileId)
      await refreshProfile()
    } catch (error) {
      toast.error('Could not update follow status', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      size="sm"
      variant={isFollowing ? 'secondary' : 'default'}
      disabled={pending}
      onClick={handleClick}
      className={cn('rounded-full', className)}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
}
