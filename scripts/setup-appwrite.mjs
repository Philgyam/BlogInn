/**
 * Recreates the BlogInn Appwrite backend (database, collections, attributes,
 * indexes and storage bucket) using fixed resource IDs so .env stays predictable.
 *
 * Usage (PowerShell):
 *   1. Put your endpoint + project id into .env
 *        VITE_APPWRITE_URL="https://<region>.cloud.appwrite.io/v1"
 *        VITE_APPWRITE_PROJECT_ID="<your project id>"
 *   2. Create a server API key in the console with scopes:
 *        databases.read, databases.write, collections.write,
 *        attributes.write, indexes.write, buckets.write
 *   3. Put APPWRITE_API_KEY in .env without a VITE_ prefix, then run
 *      npm run setup:appwrite
 *
 * The script is idempotent — re-running it skips anything that already exists.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { Client, Databases, Storage, Permission, Role } from 'node-appwrite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

function loadEnvFile(fileName) {
  const out = {}
  try {
    const raw = readFileSync(join(ROOT, fileName), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // no .env yet
  }
  return out
}

const fileEnv = loadEnvFile('.env')
const pick = (key, fallback) => process.env[key] || fileEnv[key] || fallback

const endpoint = pick('VITE_APPWRITE_URL')
const projectId = pick('VITE_APPWRITE_PROJECT_ID')
const apiKey = pick('APPWRITE_API_KEY')

// Resource IDs come from .env so the script targets your actual database/bucket
const DB_ID = pick('VITE_APPWRITE_DATABASE_ID', 'bloginn')
const POSTS = pick('VITE_APPWRITE_COLLECTION_ID', 'posts')
const PROFILES = pick('VITE_APPWRITE_PROFILE_COLLECTION_ID', 'profiles')
const COMMENTS = pick('VITE_APPWRITE_COMMENT_COLLECTION_ID', 'comments')
const BUCKET = pick('VITE_APPWRITE_BUCKET_ID', 'images')

const missingConfig = [
  !endpoint && 'VITE_APPWRITE_URL',
  !projectId && 'VITE_APPWRITE_PROJECT_ID',
  !apiKey && 'APPWRITE_API_KEY',
].filter(Boolean)

if (missingConfig.length > 0) {
  console.error(
    `\nMissing config: ${missingConfig.join(', ')}.\n` +
      'Keep VITE_APPWRITE_* values and the server-only APPWRITE_API_KEY in .env.\n',
  )
  process.exit(1)
}

const keySource = process.env.APPWRITE_API_KEY ? 'terminal env' : '.env'
const keyFingerprint = `${apiKey.slice(0, 14)}…${apiKey.slice(-4)} (len ${apiKey.length}, from ${keySource})`
console.log(`Using API key: ${keyFingerprint}`)

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
const databases = new Databases(client)
const storage = new Storage(client)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Runs an operation, ignoring "already exists" (409) so the script is idempotent. */
async function ensure(label, fn) {
  try {
    await fn()
    console.log(`  + ${label}`)
  } catch (err) {
    if (err?.code === 409) {
      console.log(`  = ${label} (exists)`)
    } else {
      console.error(`  ! ${label} — ${err?.message || err}`)
      throw err
    }
  }
}

/** Creates a resource only when a get() reports it missing (404) — avoids plan-limit errors. */
async function ensureResource(label, get, create) {
  try {
    await get()
    console.log(`  = ${label} (exists)`)
  } catch (err) {
    if (err?.code === 404) {
      await create()
      console.log(`  + ${label}`)
    } else {
      console.error(`  ! ${label} — ${err?.message || err}`)
      throw err
    }
  }
}

async function waitForAttributes(collectionId) {
  for (let i = 0; i < 30; i++) {
    const { attributes } = await databases.listAttributes(DB_ID, collectionId)
    const pending = attributes.filter((a) => a.status !== 'available')
    if (pending.length === 0) return
    await sleep(1000)
  }
  console.warn(`  ~ attributes for ${collectionId} still processing; indexes may need a re-run`)
}

async function main() {
  console.log(`\nSetting up BlogInn backend on ${endpoint} (project ${projectId})\n`)

  // Database (reuse the existing one; free plan allows only one)
  await ensureResource(
    `database "${DB_ID}"`,
    () => databases.get(DB_ID),
    () => databases.create(DB_ID, 'BlogInn'),
  )

  // Collections (posts/comments use document-level security; profiles use collection-level)
  await ensure(`collection "${POSTS}"`, () =>
    databases.createCollection(
      DB_ID,
      POSTS,
      'Posts',
      [Permission.read(Role.any()), Permission.create(Role.users())],
      true,
    ),
  )
  await ensure(`collection "${COMMENTS}"`, () =>
    databases.createCollection(
      DB_ID,
      COMMENTS,
      'Comments',
      [Permission.read(Role.any()), Permission.create(Role.users())],
      true,
    ),
  )
  await ensure(`collection "${PROFILES}"`, () =>
    databases.createCollection(
      DB_ID,
      PROFILES,
      'Profiles',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false,
    ),
  )

  // Attributes
  console.log('\nPosts attributes:')
  await ensure('Title', () => databases.createStringAttribute(DB_ID, POSTS, 'Title', 255, true))
  await ensure('Content', () => databases.createStringAttribute(DB_ID, POSTS, 'Content', 1000000, false))
  await ensure('Category', () => databases.createStringAttribute(DB_ID, POSTS, 'Category', 100, true))
  await ensure('Author', () => databases.createStringAttribute(DB_ID, POSTS, 'Author', 255, true))
  await ensure('Avatar', () => databases.createStringAttribute(DB_ID, POSTS, 'Avatar', 2000, false))
  await ensure('dateCreated', () => databases.createStringAttribute(DB_ID, POSTS, 'dateCreated', 40, true))
  await ensure('postDescribe', () => databases.createStringAttribute(DB_ID, POSTS, 'postDescribe', 2000, false))
  await ensure('postImage', () => databases.createStringAttribute(DB_ID, POSTS, 'postImage', 2000, false))
  await ensure('postID', () => databases.createStringAttribute(DB_ID, POSTS, 'postID', 100, true))
  await ensure('isArchived', () => databases.createBooleanAttribute(DB_ID, POSTS, 'isArchived', false, false))
  await ensure('likes', () => databases.createStringAttribute(DB_ID, POSTS, 'likes', 100, false, undefined, true))
  await ensure('dislikes', () => databases.createStringAttribute(DB_ID, POSTS, 'dislikes', 100, false, undefined, true))

  console.log('\nProfiles attributes:')
  await ensure('username', () => databases.createStringAttribute(DB_ID, PROFILES, 'username', 255, false))
  await ensure('UserDescription', () => databases.createStringAttribute(DB_ID, PROFILES, 'UserDescription', 2000, false))
  await ensure('UserAvatar', () => databases.createStringAttribute(DB_ID, PROFILES, 'UserAvatar', 2000, false))
  await ensure('profile_id', () => databases.createStringAttribute(DB_ID, PROFILES, 'profile_id', 100, true))
  await ensure('following', () => databases.createStringAttribute(DB_ID, PROFILES, 'following', 100, false, undefined, true))
  await ensure('interests', () => databases.createStringAttribute(DB_ID, PROFILES, 'interests', 100, false, undefined, true))

  console.log('\nComments attributes:')
  await ensure('author', () => databases.createStringAttribute(DB_ID, COMMENTS, 'author', 255, false))
  await ensure('date_commented', () => databases.createStringAttribute(DB_ID, COMMENTS, 'date_commented', 40, false))
  await ensure('post_id', () => databases.createStringAttribute(DB_ID, COMMENTS, 'post_id', 100, true))
  await ensure('userAvatar', () => databases.createStringAttribute(DB_ID, COMMENTS, 'userAvatar', 2000, false))
  await ensure('content', () => databases.createStringAttribute(DB_ID, COMMENTS, 'content', 5000, true))

  // Indexes depend on attributes being "available"
  console.log('\nWaiting for attributes to finish processing…')
  await waitForAttributes(POSTS)
  await waitForAttributes(PROFILES)
  await waitForAttributes(COMMENTS)

  console.log('\nIndexes:')
  await ensure('posts.idx_archived_date', () =>
    databases.createIndex(DB_ID, POSTS, 'idx_archived_date', 'key', ['isArchived', 'dateCreated'], ['ASC', 'DESC']),
  )
  await ensure('posts.idx_postID', () =>
    databases.createIndex(DB_ID, POSTS, 'idx_postID', 'key', ['postID']),
  )
  await ensure('posts.idx_author', () =>
    databases.createIndex(DB_ID, POSTS, 'idx_author', 'key', ['Author']),
  )
  await ensure('posts.idx_category', () =>
    databases.createIndex(DB_ID, POSTS, 'idx_category', 'key', ['Category']),
  )
  await ensure('comments.idx_post_id', () =>
    databases.createIndex(DB_ID, COMMENTS, 'idx_post_id', 'key', ['post_id']),
  )

  // Storage bucket for uploaded images (reuse existing; ensure correct permissions)
  console.log('\nStorage:')
  const bucketPerms = [Permission.read(Role.any()), Permission.create(Role.users())]
  const bucketExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  try {
    const existing = await storage.getBucket(BUCKET)
    await storage.updateBucket(
      BUCKET,
      existing.name || 'Images',
      bucketPerms,
      false,
      true,
      30 * 1024 * 1024,
      bucketExts,
    )
    console.log(`  = bucket "${BUCKET}" (permissions updated)`)
  } catch (err) {
    if (err?.code === 404) {
      await storage.createBucket(BUCKET, 'Images', bucketPerms, false, true, 30 * 1024 * 1024, bucketExts)
      console.log(`  + bucket "${BUCKET}"`)
    } else {
      console.error(`  ! bucket "${BUCKET}" — ${err?.message || err}`)
      throw err
    }
  }

  console.log('\nDone. Confirm these lines are in your .env:\n')
  console.log(`  VITE_APPWRITE_DATABASE_ID="${DB_ID}"`)
  console.log(`  VITE_APPWRITE_COLLECTION_ID="${POSTS}"`)
  console.log(`  VITE_APPWRITE_PROFILE_COLLECTION_ID="${PROFILES}"`)
  console.log(`  VITE_APPWRITE_COMMENT_COLLECTION_ID="${COMMENTS}"`)
  console.log(`  VITE_APPWRITE_BUCKET_ID="${BUCKET}"`)
  console.log('\nThen restart the dev server: npm run dev\n')
}

main().catch((err) => {
  console.error('\nSetup failed:', err?.message || err)
  process.exit(1)
})
