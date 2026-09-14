import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Editor } from '@tinymce/tinymce-react'
import { FileText, ImagePlus, Loader2, Send, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPost, uploadImage } from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { env } from '@/lib/env'
import { CATEGORIES } from '@/types'

const postSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters'),
  postDescribe: z.string().min(1, 'Add a short preview description'),
  category: z.string().min(1, 'Choose a category'),
  content: z.string().min(1, 'Write something before publishing'),
})

type PostFormValues = z.infer<typeof postSchema>

export default function AddPost() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { username, avatar } = useProfile()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', postDescribe: '', category: '', content: '' },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values: PostFormValues) => {
    if (!user) return
    if (!imageFile) {
      toast.error('Please choose a preview image')
      return
    }

    setSubmitting(true)
    try {
      const postImage = await uploadImage(imageFile)
      await createPost({
        title: values.title,
        content: values.content,
        category: values.category,
        postDescribe: values.postDescribe,
        author: username,
        avatar,
        postImage,
        userId: user.$id,
      })
      toast.success('Your post is live!')
      navigate('/home')
    } catch (error) {
      toast.error('Could not publish your post', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary">WRITING STUDIO</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">New story</h1>
        </div>
        <span className="glass rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
          Draft
        </span>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]"
      >
        <section className="glass min-w-0 rounded-3xl border-transparent p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-primary">MANUSCRIPT</p>
              <h2 className="text-xl font-bold">Story details</h2>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your story a title"
                className="glass h-14 rounded-2xl border-transparent px-4 text-lg font-semibold"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="postDescribe">Preview description</Label>
              <Textarea
                id="postDescribe"
                placeholder="A short introduction for the feed"
                className="glass min-h-24 rounded-2xl border-transparent p-4 leading-6"
                {...register('postDescribe')}
              />
              {errors.postDescribe && (
                <p className="text-sm text-destructive">{errors.postDescribe.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              <div className="overflow-hidden rounded-2xl border border-white/40 shadow-sm">
                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <Editor
                      apiKey={env.tinymceApiKey}
                      initialValue="<p>Tell your story…</p>"
                      init={{
                        height: 520,
                        menubar: false,
                        plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'insertdatetime', 'media', 'table', 'wordcount'],
                        toolbar:
                          'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link | removeformat',
                      }}
                      onEditorChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
          <section className="glass rounded-3xl border-transparent p-5">
            <p className="text-xs font-semibold text-primary">PUBLISHING</p>
            <h2 className="mt-1 text-xl font-bold">Finish the story</h2>

            <div className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="glass h-11 w-full rounded-2xl border-transparent">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="preview-image">Cover image</Label>
                <label
                  htmlFor="preview-image"
                  className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-foreground/20 bg-foreground/[0.03]"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Cover preview" className="size-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Change cover
                      </span>
                    </>
                  ) : (
                    <span className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ImagePlus className="size-5" />
                      </span>
                      <span className="text-sm font-medium">Choose cover</span>
                    </span>
                  )}
                </label>
                <Input
                  id="preview-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </div>

              <Button type="submit" disabled={submitting} className="h-11 w-full rounded-full">
                {submitting ? <Loader2 className="animate-spin" /> : <Send className="size-4" />}
                Publish story
              </Button>
            </div>
          </section>

          <div className="glass flex items-center gap-3 rounded-3xl p-4 text-sm text-muted-foreground">
            <UploadCloud className="size-5 shrink-0 text-primary" />
            <span>{imageFile ? imageFile.name : 'No cover selected'}</span>
          </div>
        </aside>
      </form>
    </div>
  )
}
