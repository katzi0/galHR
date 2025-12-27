import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      department: 'Management',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create employee users
  const employee1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'EMPLOYEE',
      department: 'Engineering',
      phoneNumber: '+1234567890',
    },
  })
  console.log('Created employee:', employee1.email)

  const employee2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'EMPLOYEE',
      department: 'Marketing',
      phoneNumber: '+1234567891',
    },
  })
  console.log('Created employee:', employee2.email)

  // Create volunteer user
  const volunteer = await prisma.user.upsert({
    where: { email: 'volunteer@example.com' },
    update: {},
    create: {
      email: 'volunteer@example.com',
      password: hashedPassword,
      name: 'Volunteer User',
      role: 'VOLUNTEER',
      phoneNumber: '+1234567892',
    },
  })
  console.log('Created volunteer:', volunteer.email)

  // Create sample entries for employee1
  await prisma.entry.create({
    data: {
      userId: employee1.id,
      type: 'WORK_HOURS',
      status: 'APPROVED',
      date: new Date('2024-01-15'),
      hoursWorked: 8,
      description: 'Regular work day',
    },
  })

  await prisma.entry.create({
    data: {
      userId: employee1.id,
      type: 'EXPENSE',
      status: 'PENDING',
      date: new Date('2024-01-16'),
      expenseAmount: 50.00,
      expenseCategory: 'Office Supplies',
      description: 'Purchased office materials',
    },
  })

  await prisma.entry.create({
    data: {
      userId: employee1.id,
      type: 'VACATION',
      status: 'PENDING',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-05'),
      vacationDays: 5,
      description: 'Family vacation',
    },
  })

  // Create sample entries for employee2
  await prisma.entry.create({
    data: {
      userId: employee2.id,
      type: 'WORK_HOURS',
      status: 'PENDING',
      date: new Date('2024-01-15'),
      hoursWorked: 7.5,
      description: 'Marketing campaign work',
    },
  })

  await prisma.entry.create({
    data: {
      userId: employee2.id,
      type: 'TRAVEL',
      status: 'APPROVED',
      travelDate: new Date('2024-01-10'),
      travelFrom: 'Office',
      travelTo: 'Client Site',
      travelKm: 45.5,
      description: 'Client meeting',
    },
  })

  // Create sample entries for volunteer
  await prisma.entry.create({
    data: {
      userId: volunteer.id,
      type: 'WORK_HOURS',
      status: 'APPROVED',
      date: new Date('2024-01-14'),
      hoursWorked: 4,
      description: 'Community event support',
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

