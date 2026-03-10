import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function test() {
    console.log('--- Iniciando Teste de Registro Real ---');
    try {
        console.log('Tentando criar usuário de teste...');
        const user = await prisma.user.create({
            data: {
                nome: 'Teste Claude local',
                email: `teste_local_${Date.now()}@test.com`,
                senhaHash: await bcrypt.hash('senha123', 12),
                consentimento: {
                    create: {
                        aceitouEm: new Date(),
                        ipOrigem: '127.0.0.1',
                        versao: '1.0',
                    },
                },
            },
        });
        console.log('✅ Usuário criado com sucesso no Supabase!');
        console.log(user);

        // Deletar para não poluir
        await prisma.user.delete({ where: { id: user.id } });
        console.log('🗑️ Usuário de teste removido.');

    } catch (error) {
        console.error('❌ ERRO NO REGISTRO:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
