import { useCallback, useEffect, useState } from 'react'

import { listCommentCounts, listPosts, listProfiles, trendingPosts, forYouPosts } from '@/lib/appwrite'
import { useProfile } from '@/context/ProfileContext'
import type { PostDoc } from '@/types'

export type FeedMode = 'recent' | 'trending' | 'forYou'

export function usePostFeed(mode: FeedMode) {
  const { profile } = useProfile()
  const [posts, setPosts] = useState<PostDoc[]>([])
  const [avatars, setAvatars] = useState<Record<string, string>>({})
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [fetchedPosts, profiles, counts] = await Promise.all([
        mode === 'trending'
          ? trendingPosts()
          : mode === 'forYou'
            ? forYouPosts(profile)
            : listPosts(),
        listProfiles(),
        listCommentCounts(),
      ])
      setPosts(fetchedPosts)
      setCommentCounts(counts)
      const map: Record<string, string> = {}
      profiles.forEach((p) => {
        map[p.profile_id] = p.UserAvatar
      })
      setAvatars(map)
    } finally {
      setLoading(false)
    }
  }, [mode, profile])

  useEffect(() => {
    load()
  }, [load])

  const updatePost = (updated: PostDoc) => {
    setPosts((prev) => prev.map((p) => (p.$id === updated.$id ? updated : p)))
  }

  return { posts, avatars, commentCounts, loading, updatePost, reload: load }
}
