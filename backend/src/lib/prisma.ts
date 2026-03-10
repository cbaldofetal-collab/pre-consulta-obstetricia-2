import { PrismaClient } from '@prisma/client';

// Função para limpar a URL de conexão (remover espaços, quebras de linha, etc)
const cleanDatabaseUrl = (url?: string) => {
    if (!url) return undefined;
    // Remove espaços, quebras de linha e tabs do início e do fim, 
    // e também qualquer quebra de linha interna que tenha sido colada por erro
    return url.trim().replace(/[\r\n\t]/g, '');
};

console.log('🔑 Chaves de Ambiente:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('URL')));

const databaseUrl = cleanDatabaseUrl(process.env.DATABASE_URL);

if (databaseUrl) {
    const masked = databaseUrl.replace(/:[^@:]+@/, ':****@');
    console.log('📡 Usando DATABASE_URL (limpa):', masked);
} else {
    console.warn('⚠️ DATABASE_URL não encontrada!');
}

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});


export default prisma;
