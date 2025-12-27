"use client"

import { useRouter } from "@/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Settings, Menu, Database } from "lucide-react"
import { useEffect, useState } from "react"
import { isMockMode, setMockMode } from "@/lib/mock-data"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from "./language-switcher"

interface UserData {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const t = useTranslations()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [mockModeEnabled, setMockModeEnabled] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setMockModeEnabled(isMockMode())
  }, [])

  function toggleMockMode(enabled: boolean) {
    setMockMode(enabled)
    setMockModeEnabled(enabled)
    // Reload the page to apply changes
    window.location.reload()
  }

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold sm:text-xl">{t('nav.hrManagement')}</h1>
          {mockModeEnabled && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Demo
            </Badge>
          )}
        </div>
        
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Mock Mode Toggle */}
          <div className="flex items-center gap-2 border-r pr-4">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline text-xs text-muted-foreground">Demo Mode</span>
            <Switch
              checked={mockModeEnabled}
              onCheckedChange={toggleMockMode}
              aria-label="Toggle demo mode"
            />
          </div>
          
          {user && (
            <>
              {/* User name - hidden on mobile */}
              <div className="hidden md:block text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full sm:h-10 sm:w-10">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {t('admin.role')}: {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {t('nav.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
