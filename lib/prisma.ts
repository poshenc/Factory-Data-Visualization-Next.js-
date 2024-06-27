import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient({
        // log: ['query']
        log: ['error']
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma