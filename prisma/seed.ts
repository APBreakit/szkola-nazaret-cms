import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial data...')

    // 1. Create Admin User
    const adminEmail = 'admin@breackly.com'
    const hashedPassword = await bcrypt.hash('admin123!', 10)

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Administrator',
            role: 'admin',
        },
    })
    console.log('Admin user seeded (email: admin@breackly.com, pass: admin123!)')

    // 2. Seed Categories
    const categories = [
        { name: 'Wydarzenia', slug: 'wydarzenia' },
        { name: 'Szkoła', slug: 'szkoła' },
        { name: 'Klasy', slug: 'klasy' },
        { name: 'Zajęcia', slug: 'zajecia' },
        { name: 'Inne', slug: 'inne' },
    ]

    for (const cat of categories) {
        await prisma.galleryCategory.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: cat,
        })
    }
    console.log('Gallery categories seeded.')

    // 3. Seed Groups (Classes)
    const classes = [
        { name: 'Klasa 1A', slug: '1a', color: '#3b82f6' },
        { name: 'Klasa 1B', slug: '1b', color: '#22c55e' },
        { name: 'Klasa 2A', slug: '2a', color: '#ef4444' },
        { name: 'Klasa 2B', slug: '2b', color: '#eab308' },
        { name: 'Klasa 3A', slug: '3a', color: '#f97316' },
        { name: 'Klasa 3B', slug: '3b', color: '#a855f7' },
        { name: 'Klasa 4A', slug: '4a', color: '#14b8a6' },
        { name: 'Klasa 4B', slug: '4b', color: '#f472b6' },
    ]

    for (const cls of classes) {
        await prisma.group.upsert({
            where: { slug: cls.slug },
            update: { name: cls.name, color: cls.color },
            create: cls,
        })
    }
    console.log('Classes seeded.')

    console.log('Seeding completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
