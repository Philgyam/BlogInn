function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

export const env = {
  appwriteUrl: required('VITE_APPWRITE_URL', import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: required(
    'VITE_APPWRITE_PROJECT_ID',
    import.meta.env.VITE_APPWRITE_PROJECT_ID,
  ),
  appwriteDatabaseId: required(
    'VITE_APPWRITE_DATABASE_ID',
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
  ),
  appwritePostsCollectionId: required(
    'VITE_APPWRITE_COLLECTION_ID',
    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  ),
  appwriteProfileCollectionId: required(
    'VITE_APPWRITE_PROFILE_COLLECTION_ID',
    import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID,
  ),
  appwriteCommentCollectionId: required(
    'VITE_APPWRITE_COMMENT_COLLECTION_ID',
    import.meta.env.VITE_APPWRITE_COMMENT_COLLECTION_ID,
  ),
  appwriteBucketId: required(
    'VITE_APPWRITE_BUCKET_ID',
    import.meta.env.VITE_APPWRITE_BUCKET_ID,
  ),
  tinymceApiKey: import.meta.env.VITE_TINYMCE_API_KEY ?? 'no-api-key',
}
