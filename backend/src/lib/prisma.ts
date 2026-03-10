import { PrismaClient } from '@prisma/client';

// Função para limpar a URL de conexão (remover espaços, quebras de linha, etc)
const cleanDatabaseUrl = (url?: string) => {
    if (!url) return undefined;
    // Remove espaços, quebras de linha e tabs do início e do fim, 
    // e também qualquer quebra de linha interna que tenha sido colada por erro
    return url.trim().replace(/[\r\n\t]/g, '');
};

const databaseUrl = cleanDatabaseUrl(process.env.DATABASE_URL);

if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL não encontrada nas variáveis de ambiente.');
}

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

export default prisma;
