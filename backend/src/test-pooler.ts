import { PrismaClient } from '@prisma/client';

const poolerUrl = "postgresql://postgres:w4y7DGm81nF16EDu@db.sixrbfjuhevcjksnjzrt.supabase.co:6543/postgres?pgbouncer=true&sslmode=require";

async function testConnection() {
    console.log("Tentando conectar com Pooler URL (6543)...");
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: poolerUrl
            }
        }
    });

    try {
        const userCount = await prisma.user.count();
        console.log("Sucesso! Total de usuários:", userCount);
    } catch (err: any) {
        console.error("Erro ao conectar:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
