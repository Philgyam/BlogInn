# BlogInn

A blogging platform built with React, TypeScript, Tailwind CSS v4, shadcn/ui, and
[Appwrite](https://appwrite.io) (auth, database, storage).

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Appwrite project details
npm run dev
```

Other scripts: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run preview`.

## Appwrite setup

You need an Appwrite project with:

- A **database** containing three collections: posts, profiles, and comments.
- A **storage bucket** for post/avatar images.
- Collection/bucket/project/database IDs filled into `.env` (see `.env.example`).

### Required attributes

The app expects these attributes on top of whatever your collections already have.
If you're setting this up fresh or upgrading an older BlogInn database, add these in
the Appwrite console (Databases → your collection → Attributes):

| Collection | Attribute | Type | Array | Notes |
|---|---|---|---|---|
| Posts | `Title`, `Content`, `Category`, `Author`, `Avatar`, `dateCreated`, `postDescribe`, `postImage`, `postID` | string | no | core post fields |
| Posts | `isArchived` | boolean | no | |
| Posts | `likes` | string | **yes** | user IDs who liked the post |
| Posts | `dislikes` | string | **yes** | user IDs who disliked the post |
| Profiles | `username`, `UserDescription`, `UserAvatar`, `profile_id` | string | no | core profile fields |
| Profiles | `following` | string | **yes** | profile IDs this user follows |
| Profiles | `interests` | string | **yes** | category names picked during onboarding |
| Comments | `author`, `date_commented`, `post_id`, `userAvatar`, `content` | string | no | |

Likes/follows/interests degrade gracefully (toasts an error instead of crashing) if
these attributes don't exist yet, but Trending/For You/Community won't be meaningful
until they're added.

## Stack notes

- **UI**: Tailwind CSS v4 (CSS-first config in `src/index.css`) + hand-authored
  shadcn/ui primitives in `src/components/ui`.
- **Data layer**: `src/lib/appwrite.ts` is the single Appwrite client and the only
  place that talks to the database/storage directly.
- **Theming**: light/dark via `next-themes`, toggle in the sidebar/header.
