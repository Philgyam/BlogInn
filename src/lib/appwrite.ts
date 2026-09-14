import {
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Query,
  Permission,
  Role,
} from 'appwrite'

import { env } from '@/lib/env'
import type { CommentDoc, PostDoc, ProfileDoc } from '@/types'

export const client = new Client()
  .setEndpoint(env.appwriteUrl)
  .setProject(env.appwriteProjectId)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

const DB = env.appwriteDatabaseId
const POSTS = env.appwritePostsCollectionId
const PROFILES = env.appwriteProfileCollectionId
const COMMENTS = env.appwriteCommentCollectionId
const BUCKET = env.appwriteBucketId

// ---------- Storage ----------

export async function uploadImage(file: File): Promise<string> {
  const uploaded = await storage.createFile(BUCKET, ID.unique(), file)
  return storage.getFileView(BUCKET, uploaded.$id).toString()
}

// ---------- Profiles ----------

export async function getProfile(userId: string): Promise<ProfileDoc | null> {
  try {
    return await databases.getDocument<ProfileDoc>(DB, PROFILES, userId)
  } catch {
    return null
  }
}

export async function listProfiles(): Promise<ProfileDoc[]> {
  const res = await databases.listDocuments<ProfileDoc>(DB, PROFILES, [
    Query.limit(100),
  ])
  return res.documents
}

export async function upsertProfile(
  userId: string,
  data: Partial<Pick<ProfileDoc, 'username' | 'UserDescription' | 'UserAvatar' | 'interests'>>,
): Promise<ProfileDoc> {
  const existing = await getProfile(userId)
  const payload = {
    profile_id: userId,
    following: existing?.following ?? [],
    ...data,
  }
  if (existing) {
    return databases.updateDocument<ProfileDoc>(DB, PROFILES, userId, payload)
  }
  return databases.createDocument<ProfileDoc>(DB, PROFILES, userId, {
    username: '',
    UserDescription: '',
    UserAvatar: '',
    interests: [],
    ...payload,
  })
}

export async function toggleFollow(
  myProfile: ProfileDoc,
  targetProfileId: string,
): Promise<ProfileDoc> {
  const following = myProfile.following ?? []
  const next = following.includes(targetProfileId)
    ? following.filter((id) => id !== targetProfileId)
    : [...following, targetProfileId]

  return databases.updateDocument<ProfileDoc>(DB, PROFILES, myProfile.$id, {
    following: next,
  })
}

export async function countFollowers(profileId: string): Promise<number> {
  const res = await databases.listDocuments<ProfileDoc>(DB, PROFILES, [
    Query.limit(1000),
  ])
  return res.documents.filter((profile) =>
    profile.following?.includes(profileId),
  ).length
}

// ---------- Posts ----------

const postPermissions = (userId: string) => [
  Permission.read(Role.any()),
  Permission.write(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
]

export interface CreatePostInput {
  title: string
  content: string
  category: string
  author: string
  avatar: string
  postDescribe: string
  postImage: string
  userId: string
}

export async function createPost(input: CreatePostInput): Promise<PostDoc> {
  return databases.createDocument<PostDoc>(
    DB,
    POSTS,
    ID.unique(),
    {
      Title: input.title,
      Content: input.content,
      Category: input.category,
      Author: input.author,
      Avatar: input.avatar,
      dateCreated: new Date().toISOString(),
      postDescribe: input.postDescribe,
      postImage: input.postImage,
      postID: input.userId,
      isArchived: false,
      likes: [],
      dislikes: [],
    },
    postPermissions(input.userId),
  )
}

export async function getPost(id: string): Promise<PostDoc> {
  return databases.getDocument<PostDoc>(DB, POSTS, id)
}

export async function listPosts(queries: string[] = []): Promise<PostDoc[]> {
  const res = await databases.listDocuments<PostDoc>(DB, POSTS, [
    Query.equal('isArchived', false),
    Query.orderDesc('dateCreated'),
    Query.limit(100),
    ...queries,
  ])
  return res.documents
}

export async function listPostsByUser(
  userId: string,
  archived: boolean,
): Promise<PostDoc[]> {
  const res = await databases.listDocuments<PostDoc>(DB, POSTS, [
    Query.equal('postID', userId),
    Query.equal('isArchived', archived),
    Query.orderDesc('dateCreated'),
    Query.limit(100),
  ])
  return res.documents
}

export async function listPostsByAuthor(author: string): Promise<PostDoc[]> {
  const res = await databases.listDocuments<PostDoc>(DB, POSTS, [
    Query.equal('Author', author),
    Query.equal('isArchived', false),
    Query.limit(50),
  ])
  return res.documents
}

export async function setArchived(id: string, archived: boolean) {
  return databases.updateDocument<PostDoc>(DB, POSTS, id, {
    isArchived: archived,
  })
}

export async function deletePost(id: string) {
  return databases.deleteDocument(DB, POSTS, id)
}

export async function toggleReaction(
  post: PostDoc,
  userId: string,
  reaction: 'likes' | 'dislikes',
): Promise<PostDoc> {
  const opposite = reaction === 'likes' ? 'dislikes' : 'likes'
  const current = post[reaction] ?? []
  const oppositeCurrent = post[opposite] ?? []

  const next = current.includes(userId)
    ? current.filter((id) => id !== userId)
    : [...current, userId]

  const update: Partial<PostDoc> = {}
  update[reaction] = next
  update[opposite] = oppositeCurrent.filter((id) => id !== userId)

  return databases.updateDocument<PostDoc>(DB, POSTS, post.$id, update)
}

export async function trendingPosts(): Promise<
  Array<PostDoc & { score: number }>
> {
  const [posts, commentCounts] = await Promise.all([
    listPosts(),
    listCommentCounts(),
  ])
  return posts
    .map((post) => ({
      ...post,
      score:
        (post.likes?.length ?? 0) * 2 -
        (post.dislikes?.length ?? 0) +
        (commentCounts[post.$id] ?? 0),
    }))
    .sort((a, b) => b.score - a.score)
}

export async function forYouPosts(profile: ProfileDoc | null): Promise<PostDoc[]> {
  const following = profile?.following ?? []
  const interests = profile?.interests ?? []

  if (following.length === 0 && interests.length === 0) {
    return listPosts()
  }

  const queries: string[] = []
  if (following.length > 0) queries.push(Query.equal('postID', following))
  if (interests.length > 0) queries.push(Query.equal('Category', interests))

  const results = await Promise.all(
    queries.map((q) =>
      databases
        .listDocuments<PostDoc>(DB, POSTS, [
          Query.equal('isArchived', false),
          Query.limit(100),
          q,
        ])
        .then((r) => r.documents),
    ),
  )

  const seen = new Map<string, PostDoc>()
  for (const list of results) {
    for (const post of list) seen.set(post.$id, post)
  }

  if (seen.size === 0) return listPosts()

  return [...seen.values()].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  )
}

// ---------- Comments ----------

export async function listComments(postId: string): Promise<CommentDoc[]> {
  const res = await databases.listDocuments<CommentDoc>(DB, COMMENTS, [
    Query.equal('post_id', postId),
    Query.orderDesc('$createdAt'),
    Query.limit(200),
  ])
  return res.documents
}

export async function listCommentCounts(): Promise<Record<string, number>> {
  const res = await databases.listDocuments<CommentDoc>(DB, COMMENTS, [
    Query.limit(1000),
  ])
  const counts: Record<string, number> = {}
  for (const comment of res.documents) {
    counts[comment.post_id] = (counts[comment.post_id] ?? 0) + 1
  }
  return counts
}

export async function createComment(input: {
  author: string
  postId: string
  userAvatar: string
  content: string
  userId: string
}): Promise<CommentDoc> {
  return databases.createDocument<CommentDoc>(
    DB,
    COMMENTS,
    ID.unique(),
    {
      author: input.author,
      date_commented: new Date().toISOString(),
      post_id: input.postId,
      userAvatar: input.userAvatar,
      content: input.content,
    },
    postPermissions(input.userId),
  )
}
