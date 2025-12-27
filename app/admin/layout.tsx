"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout requireAdmin={true}>{children}</DashboardLayout>
}

