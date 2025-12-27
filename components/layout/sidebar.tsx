"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  DollarSign,
  Plane,
  Calendar,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'

interface SidebarProps {
  role?: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ role, isMobileOpen, onMobileClose }: SidebarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>(role || "")

  useEffect(() => {
    if (!role) {
      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        setUserRole(user.role)
      }
    }
  }, [role])

  const adminLinks = [
    {
      href: "/admin",
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: "/admin/users",
      label: t('users'),
      icon: Users,
    },
    {
      href: "/admin/entries",
      label: t('entries'),
      icon: FileText,
    },
  ]

  const userLinks = [
    {
      href: "/dashboard",
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/hours",
      label: t('workHours'),
      icon: Clock,
    },
    {
      href: "/dashboard/expenses",
      label: t('expenses'),
      icon: DollarSign,
    },
    {
      href: "/dashboard/vacation",
      label: t('vacation'),
      icon: Calendar,
    },
    {
      href: "/dashboard/travel",
      label: t('travel'),
      icon: Plane,
    },
  ]

  const links = userRole === "ADMIN" ? adminLinks : userLinks

  return (
    <aside className="w-64 border-r bg-muted/40">
      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
