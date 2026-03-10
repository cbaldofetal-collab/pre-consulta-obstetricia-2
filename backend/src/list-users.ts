import { PrismaClient } from '@prisma/client';

const poolerUrl = "postgresql://postgres:w4y7DGm81nF16EDu@db.sixrbfjuhevcjksnjzrt.supabase.co:6543/postgres?pgbouncer=true&sslmode=require";

async function listUsers() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: poolerUrl
            }
        }
    });

    try {
        const users = await prisma.user.findMany({
            select: { email: true, nome: true }
        });
        console.log("Usuários no banco:", JSON.stringify(users, null, 2));
    } catch (err: any) {
        console.error("Erro:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
