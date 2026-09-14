import { Link } from 'react-router-dom'
import { PenLine } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPostList } from '@/components/UserPostList'
import { useProfile } from '@/context/ProfileContext'
import UserBio from '@/pages/UserBio'

export default function Profile() {
  const { profile, username, avatar } = useProfile()

  return (
    <Tabs defaultValue="posts" className="gap-0">
      <section className="border-b border-white/30 px-4 py-8 lg:px-6 lg:py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="size-24 ring-4 ring-white/50 shadow-lg">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="text-2xl font-semibold">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary">YOUR SPACE</p>
            <h1 className="mt-1 truncate text-3xl font-bold sm:text-4xl">
              {username || 'Your profile'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {profile?.UserDescription || 'Your stories, ideas, and saved drafts live here.'}
            </p>
            {profile?.interests && profile.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.slice(0, 4).map((interest) => (
                  <Badge key={interest} variant="secondary" className="rounded-full">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button asChild className="h-11 rounded-full px-5 sm:self-start">
            <Link to="/addPost">
              <PenLine className="size-4" />
              New story
            </Link>
          </Button>
        </div>
      </section>

      <div className="glass-nav sticky top-[65px] z-20 border-b px-4 py-3 lg:top-0 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="posts">Published</TabsTrigger>
            <TabsTrigger value="bio">Edit profile</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="posts">
        <UserPostList archived={false} />
      </TabsContent>
      <TabsContent value="bio">
        <UserBio />
      </TabsContent>
      <TabsContent value="archive">
        <UserPostList archived={true} />
      </TabsContent>
    </Tabs>
  )
}
