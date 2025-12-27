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
  BarChart3,
} from "lucide-react"
import { useEffect, useState } from "react"

interface SidebarProps {
  role?: string
}

export function Sidebar({ role }: SidebarProps) {
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
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/admin/entries",
      label: "Entries",
      icon: FileText,
    },
  ]

  const userLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/hours",
      label: "Work Hours",
      icon: Clock,
    },
    {
      href: "/dashboard/expenses",
      label: "Expenses",
      icon: DollarSign,
    },
    {
      href: "/dashboard/vacation",
      label: "Vacation",
      icon: Calendar,
    },
    {
      href: "/dashboard/travel",
      label: "Travel",
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

