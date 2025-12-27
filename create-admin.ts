// Simple script to create an admin user
import { prisma } from './lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Creating admin user...')
  
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  try {
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
    
    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')
    console.log('')
    console.log('You can now login at: https://galhr.vercel.app')
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

