import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, Calendar, Plane, Users, FileCheck } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          HR Management System
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-muted-foreground">
          Streamline your HR processes with our comprehensive management system.
          Track hours, manage expenses, approve vacation requests, and more.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Register
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">Key Features</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Work Hours Tracking</CardTitle>
                <CardDescription>
                  Easily submit and track your work hours with detailed descriptions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Expense Management</CardTitle>
                <CardDescription>
                  Submit expense reports with receipt uploads for quick reimbursement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Vacation Requests</CardTitle>
                <CardDescription>
                  Request time off and track your vacation days effortlessly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Plane className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Travel Reports</CardTitle>
                <CardDescription>
                  Log business travel with distance tracking for accurate reimbursement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">User Management</CardTitle>
                <CardDescription>
                  Admins can manage users and their roles across the organization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileCheck className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Approval Workflow</CardTitle>
                <CardDescription>
                  Streamlined approval process for all submissions with status tracking
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Join our HR management system today
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Create Account</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

