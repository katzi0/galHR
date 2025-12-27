#!/bin/bash

echo "🔧 Setting up HR Management System Database..."
echo ""

# Pull environment variables from Vercel
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.local

# Check if .env.local was created
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found. Make sure you've set up the database in Vercel first."
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed. Check your database connection."
    exit 1
fi

echo ""

# Ask if user wants to seed
read -p "Would you like to seed the database with sample data? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully"
        echo ""
        echo "📝 Default login credentials:"
        echo "   Admin: admin@example.com / admin123"
        echo "   Employee: john@example.com / admin123"
        echo "   Employee: jane@example.com / admin123"
        echo "   Volunteer: volunteer@example.com / admin123"
    else
        echo "❌ Seeding failed"
        exit 1
    fi
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "🚀 Your app should now work at: https://galhr.vercel.app"
echo ""
echo "Next steps:"
echo "1. Visit https://galhr.vercel.app"
echo "2. Try logging in with the credentials above (if seeded)"
echo "3. Or register a new account"

