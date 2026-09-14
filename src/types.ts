import type { Models } from 'appwrite'

export const CATEGORIES = [
  'Technology',
  'DIY',
  'Fashion',
  'Education',
  'Health',
  'Relationship',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface PostDoc extends Models.Document {
  Title: string
  Content: string
  Category: string
  Author: string
  Avatar: string
  dateCreated: string
  postDescribe: string
  postImage: string
  postID: string
  isArchived: boolean
  likes?: string[]
  dislikes?: string[]
}

export interface ProfileDoc extends Models.Document {
  username: string
  UserDescription: string
  UserAvatar: string
  profile_id: string
  following?: string[]
  interests?: string[]
}

export interface CommentDoc extends Models.Document {
  author: string
  date_commented: string
  post_id: string
  userAvatar: string
  content: string
}
