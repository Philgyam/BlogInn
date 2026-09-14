import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BookOpenText,
  Home,
  UserCircle,
  PlusCircle,
  Users,
  LogOut,
  Menu,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ThemeToggle'

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/profile', label: 'My Page', icon: UserCircle },
  { to: '/addPost', label: 'Add Post', icon: PlusCircle },
  { to: '/community', label: 'Community', icon: Users },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.98]',
              isActive
                ? 'glass-strong text-primary shadow-sm'
                : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground',
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function ProfileBlock() {
  const { username, avatar } = useProfile()
  return (
    <div className="mx-3 flex items-center gap-3 rounded-2xl bg-foreground/[0.04] p-3">
      <Avatar className="ring-2 ring-white/40">
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="truncate text-sm font-medium text-foreground">
        {username || 'Blogger'}
      </div>
    </div>
  )
}

function LogoutButton({ className }: { className?: string }) {
  const { logoutUser } = useAuth()
  return (
    <Button
      variant="ghost"
      onClick={logoutUser}
      className={cn(
        'justify-start gap-3 rounded-2xl text-foreground/70 hover:bg-destructive/10 hover:text-destructive',
        className,
      )}
    >
      <LogOut className="size-4" />
      Logout
    </Button>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="glass-nav hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between lg:border-r lg:py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-4">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <BookOpenText className="size-5" />
          </span>
          <div>
            <div className="text-xl font-bold text-primary">BlogInn</div>
            <p className="text-xs text-muted-foreground">Independent stories</p>
          </div>
        </div>
        <ProfileBlock />
        <div className="px-3">
          <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">NAVIGATE</p>
          <NavItems />
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs text-foreground/50">Theme</span>
          <ThemeToggle />
        </div>
        <LogoutButton />
      </div>
    </aside>
  )
}

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <div className="glass-nav sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 lg:hidden">
      <span className="text-xl font-bold text-primary">BlogInn</span>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="glass-strong border-transparent text-foreground"
          >
            <SheetHeader>
              <SheetTitle className="text-primary">BlogInn</SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col justify-between px-3 pb-4">
              <div className="flex flex-col gap-6">
                <ProfileBlock />
                <NavItems onNavigate={() => setOpen(false)} />
              </div>
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="glass-strong fixed right-3 bottom-3 left-3 z-40 grid grid-cols-4 rounded-3xl p-1.5 lg:hidden"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition-all',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground',
            )
          }
        >
          <Icon className="size-4" />
          <span className="truncate">{label === 'My Page' ? 'Profile' : label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
