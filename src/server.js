/**
 * =====================================================
 * GRÃO & CÓDIGO - Servidor Principal
 * =====================================================
 * API da Cafeteria - Projeto Educacional
 * 
 * ⚠️ AVISO: Este projeto contém vulnerabilidades PROPOSITAIS
 * para fins educacionais. NÃO use em produção!
 */

const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database/connection');

// Importação das rotas
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const vulnerableRoutes = require('./routes/vulnerable');
const buggyRoutes = require('./routes/buggy');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (interface CTF)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Middleware de logging simples
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// =====================================================
// ROTAS
// =====================================================

// Rota de Health Check
app.get('/', (req, res) => {
    res.json({
        message: '☕ Bem-vindo à API Grão & Código!',
        version: '1.0.0',
        documentation: '/api/docs',
        ctf_interface: '/ctf',
        endpoints: {
            products: '/api/products',
            categories: '/api/categories',
            users: '/api/users',
            orders: '/api/orders',
            auth: '/api/auth',
            vulnerable: '/api/vulnerable (⚠️ CTF)',
            buggy: '/api/buggy (🐛 Bugs para corrigir)'
        }
    });
});

// Rota para interface CTF
app.get('/ctf', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ctf.html'));
});

// Rota de documentação básica
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'Grão & Código - Documentação da API',
        description: 'API de gestão para uma cafeteria gourmet',
        sections: {
            exploration: {
                description: '🔍 Rotas para exploração com Postman',
                routes: [
                    'GET /api/products - Lista todos os produtos',
                    'GET /api/products/:id - Busca produto por ID',
                    'GET /api/categories - Lista todas as categorias',
                    'GET /api/orders - Lista todos os pedidos',
                    'POST /api/auth/login - Realiza login'
                ]
            },
            ctf: {
                description: '🚩 Rotas vulneráveis - Capture The Flag',
                hint: 'Estas rotas são PROPOSITALMENTE vulneráveis a SQL Injection',
                routes: [
                    'GET /api/vulnerable/search?q= - Busca vulnerável',
                    'POST /api/vulnerable/login - Login vulnerável',
                    'GET /api/vulnerable/product/:id - Produto vulnerável'
                ]
            },
            buggy: {
                description: '🐛 Rotas com bugs para correção',
                hint: 'Encontre e corrija os bugs nestas rotas',
                routes: [
                    'GET /api/buggy/products - Lista com bug',
                    'POST /api/buggy/order - Criar pedido com bug',
                    'GET /api/buggy/total/:orderId - Cálculo com bug'
                ]
            }
        }
    });
});

// Rotas da API
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vulnerable', vulnerableRoutes);
app.use('/api/buggy', buggyRoutes);

// Middleware de erro 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.url} não existe`,
        hint: 'Acesse / para ver as rotas disponíveis'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err.message);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: err.message,
        // Em ambiente de desenvolvimento, mostra mais detalhes
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// =====================================================
// INICIALIZAÇÃO DO SERVIDOR
// =====================================================

async function startServer() {
    try {
        // Conecta ao banco de dados
        await initializeDatabase();
        
        // Inicia o servidor
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════');
            console.log('   ☕ GRÃO & CÓDIGO - API da Cafeteria');
            console.log('═══════════════════════════════════════════════════');
            console.log(`   🚀 Servidor rodando em: http://localhost:${PORT}`);
            console.log(`   📚 Documentação: http://localhost:${PORT}/api/docs`);
            console.log(`   🚩 Interface CTF: http://localhost:${PORT}/ctf`);
            console.log('');
            console.log('   ⚠️  AVISO: Este é um ambiente de TREINAMENTO');
            console.log('   ⚠️  Contém vulnerabilidades propositais!');
            console.log('═══════════════════════════════════════════════════');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar o servidor:', error.message);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando servidor...');
    const { closeDatabase } = require('./database/connection');
    await closeDatabase();
    process.exit(0);
});

startServer();
