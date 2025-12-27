"use client"

import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { isMockMode, getMockUsers } from "@/lib/mock-data"

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
  phoneNumber?: string
  createdAt: string
  _count: {
    entries: number
  }
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      // Check if mock mode is enabled
      if (isMockMode()) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 300)) // Simulate loading
        setUsers(getMockUsers())
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch users")
      }

      setUsers(result)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  async function deleteUser(userId: string) {
    try {
      // Check if mock mode is enabled
      if (isMockMode()) {
        // Simulate delete in mock mode
        await new Promise(resolve => setTimeout(resolve, 300))
        toast({
          title: "Success (Demo Mode)",
          description: "User deleted successfully (demo only)",
        })
        fetchUsers()
        setDeleteUserId(null)
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete user")
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      })

      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setDeleteUserId(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function getRoleBadge(role: string) {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      ADMIN: "default",
      EMPLOYEE: "secondary",
      VOLUNTEER: "outline",
    }
    return <Badge variant={variants[role] || "default"}>{role}</Badge>
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  return (
    <>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Email</TableHead>
                  <TableHead className="whitespace-nowrap">Role</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Department</TableHead>
                  <TableHead className="whitespace-nowrap hidden lg:table-cell">Entries</TableHead>
                  <TableHead className="whitespace-nowrap hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{user.department || "N/A"}</TableCell>
                    <TableCell className="whitespace-nowrap hidden lg:table-cell">{user._count.entries}</TableCell>
                    <TableCell className="whitespace-nowrap hidden lg:table-cell">{format(new Date(user.createdAt), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteUserId(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and all their entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && deleteUser(deleteUserId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

