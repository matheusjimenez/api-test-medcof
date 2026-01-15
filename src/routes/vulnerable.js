/**
 * =====================================================
 * GRÃO & CÓDIGO - Rotas VULNERÁVEIS (CTF)
 * =====================================================
 * 
 * ⚠️⚠️⚠️ ATENÇÃO ⚠️⚠️⚠️
 * 
 * Estas rotas são PROPOSITALMENTE VULNERÁVEIS a SQL Injection!
 * Elas existem APENAS para fins educacionais e de treinamento.
 * 
 * NUNCA use concatenação de strings em queries SQL em produção!
 * SEMPRE use prepared statements / parameterized queries!
 * 
 * 🚩 CAPTURE THE FLAG - Encontre as flags escondidas!
 * 
 * Dicas:
 * - Flag{W3lc0m3_t0_SQL_W0rld} - 10 pontos
 * - Flag{SQL_1nj3ct10n_M4st3r} - 25 pontos (escondida em um usuário)
 * - Flag{Un10n_S3l3ct_Pr0} - 50 pontos
 * - Flag{4dm1n_P4ssw0rd_L34k3d} - 100 pontos
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const { queryRaw } = require('../database/connection');

/**
 * GET /api/vulnerable/search
 * 🚩 VULNERÁVEL A SQL INJECTION
 * 
 * Busca produtos por nome usando concatenação de strings (INSEGURO!)
 * 
 * Exemplos de payloads para testar:
 * - Normal: ?q=café
 * - Injection básica: ?q=café' OR '1'='1
 * - UNION para listar tabelas: ?q=' UNION SELECT table_name,2,3,4,5,6,7,8,9,10 FROM information_schema.tables WHERE table_schema='grao_codigo' --
 * - UNION para pegar flags: ?q=' UNION SELECT flag_code,flag_name,hint,points,5,6,7,8,9,10 FROM secret_flags --
 */
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        
        // ⚠️ VULNERÁVEL! Concatenação de strings na query!
        // NUNCA faça isso em produção!
        const sql = `
            SELECT 
                id,
                name,
                description,
                price,
                stock,
                category_id,
                active,
                created_at,
                updated_at
            FROM products 
            WHERE name LIKE '%${searchTerm}%' 
            OR description LIKE '%${searchTerm}%'
        `;
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const products = await queryRaw(sql);
        
        res.json({
            success: true,
            query: searchTerm,
            count: products.length,
            data: products,
            hint: '🚩 Esta rota é vulnerável a SQL Injection. Tente usar payloads especiais no parâmetro q!'
        });
    } catch (error) {
        // Mostra o erro SQL para ajudar no CTF
        res.status(500).json({
            success: false,
            error: error.message,
            sqlError: error.sqlMessage || null,
            hint: 'O erro acima pode te dar dicas sobre a estrutura da query!'
        });
    }
});

/**
 * POST /api/vulnerable/login
 * 🚩 VULNERÁVEL A SQL INJECTION (Bypass de autenticação)
 * 
 * Login vulnerável que permite bypass com SQL Injection
 * 
 * Exemplos de payloads:
 * - Bypass com admin: username: admin' -- , password: qualquer coisa
 * - Bypass com OR: username: ' OR '1'='1' -- , password: qualquer coisa
 * - Ver todos os usuários: username: ' OR '1'='1 , password: ' OR '1'='1
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'Username é obrigatório',
                hint: 'Tente enviar um username com aspas simples...'
            });
        }
        
        // ⚠️ VULNERÁVEL! Concatenação de strings na query!
        const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password || ''}'`;
        
        console.log('🔴 [VULNERABLE] Query de login:', sql);
        
        const users = await queryRaw(sql);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Credenciais inválidas',
                hint: 'Você poderia bypassar essa verificação com SQL Injection...'
            });
        }
        
        // Se encontrou usuário(s), retorna o primeiro
        const user = users[0];
        
        // Se conseguiu bypassar e pegar o admin
        if (user.role === 'admin') {
            res.json({
                success: true,
                message: '🚩 Parabéns! Você conseguiu fazer bypass de autenticação!',
                flag: 'Flag{4dm1n_P4ssw0rd_L34k3d}',
                points: 100,
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    // Mostra a senha para fins didáticos
                    password_hint: `A senha real era: ${user.password}`
                }
            });
        } else {
            res.json({
                success: true,
                message: 'Login realizado',
                hint: users.length > 1 ? `Você retornou ${users.length} usuários! Tente mirar no admin...` : null,
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            sqlError: error.sqlMessage || null,
            hint: 'Erro na query! Analise a mensagem para entender a estrutura.'
        });
    }
});

/**
 * GET /api/vulnerable/product/:id
 * 🚩 VULNERÁVEL A SQL INJECTION
 * 
 * Busca produto por ID usando concatenação (INSEGURO!)
 * 
 * Exemplos de payloads:
 * - Normal: /product/1
 * - UNION attack: /product/0 UNION SELECT 1,flag_code,flag_name,hint,points,6,7,8,9,10,11,12 FROM secret_flags
 * - Ver usuários: /product/0 UNION SELECT 1,username,password,email,role,6,7,8,9,10,11,12 FROM users
 */
router.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // ⚠️ VULNERÁVEL! Concatenação de strings na query!
        const sql = `
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.category_id,
                p.active,
                p.created_at,
                p.updated_at,
                c.name as category_name,
                c.description as category_description
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ${id}
        `;
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const products = await queryRaw(sql);
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado',
                hint: 'Tente usar UNION SELECT para combinar com outra tabela...'
            });
        }
        
        res.json({
            success: true,
            data: products[0],
            hint: '🚩 Esta rota aceita o ID diretamente na query. Experimente UNION SELECT!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            sqlError: error.sqlMessage || null,
            hint: 'O erro pode revelar a estrutura da query!'
        });
    }
});

/**
 * GET /api/vulnerable/users
 * 🚩 VULNERÁVEL A SQL INJECTION
 * 
 * Lista usuários com filtro vulnerável
 * 
 * Exemplos:
 * - Normal: ?role=admin
 * - Ver senhas: ?role=' OR '1'='1
 * - UNION attack: ?role=' UNION SELECT id,flag_code,flag_name,hint,points,'x','x' FROM secret_flags --
 */
router.get('/users', async (req, res) => {
    try {
        const { role } = req.query;
        
        let sql = "SELECT id, username, password, email, role, active, created_at FROM users";
        
        if (role) {
            // ⚠️ VULNERÁVEL!
            sql += ` WHERE role = '${role}'`;
        }
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const users = await queryRaw(sql);
        
        // Se conseguiu ver muitos usuários ou senhas
        const hasAdminPassword = users.some(u => u.role === 'admin' && u.password);
        
        res.json({
            success: true,
            count: users.length,
            data: users,
            hint: hasAdminPassword 
                ? '🚩 Você conseguiu ver senhas! Procure por usuários inativos com flags...'
                : 'Use o parâmetro role para filtrar. Ou tente algo mais... criativo!',
            flag: hasAdminPassword ? 'Flag{SQL_1nj3ct10n_M4st3r}' : undefined
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            sqlError: error.sqlMessage || null
        });
    }
});

/**
 * GET /api/vulnerable/order
 * 🚩 VULNERÁVEL A SQL INJECTION (ORDER BY injection)
 * 
 * Ordena produtos de forma vulnerável
 * 
 * Exemplos:
 * - Normal: ?sort=price
 * - Error-based: ?sort=price,(SELECT flag_code FROM secret_flags LIMIT 1)
 * - Blind: ?sort=IF(1=1,price,name)
 */
router.get('/order', async (req, res) => {
    try {
        const { sort } = req.query;
        const orderBy = sort || 'name';
        
        // ⚠️ VULNERÁVEL! ORDER BY injection
        const sql = `SELECT id, name, price, stock FROM products WHERE active = TRUE ORDER BY ${orderBy}`;
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const products = await queryRaw(sql);
        
        res.json({
            success: true,
            sorted_by: orderBy,
            count: products.length,
            data: products,
            hint: '🚩 O ORDER BY também pode ser explorado!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            sqlError: error.sqlMessage || null,
            hint: 'Erros podem revelar informações úteis!'
        });
    }
});

/**
 * GET /api/vulnerable/flags
 * Mostra as flags disponíveis (para referência)
 */
router.get('/flags', (req, res) => {
    res.json({
        title: '🚩 Capture The Flag - SQL Injection Challenge',
        description: 'Encontre todas as flags usando técnicas de SQL Injection!',
        rules: [
            'Cada flag tem um formato: Flag{xxxxx}',
            'As flags estão escondidas em diferentes locais do banco',
            'Use SQL Injection para encontrá-las',
            'Dicas estão nos hints das respostas'
        ],
        challenges: [
            {
                name: 'Iniciante',
                points: 10,
                hint: 'Tente listar todas as tabelas usando UNION SELECT e information_schema',
                endpoint: 'GET /api/vulnerable/search'
            },
            {
                name: 'Intermediário',
                points: 25,
                hint: 'Existe um usuário desativado com segredos na senha...',
                endpoint: 'GET /api/vulnerable/users'
            },
            {
                name: 'Avançado',
                points: 50,
                hint: 'Há uma tabela chamada secret_flags. Use UNION SELECT!',
                endpoint: 'GET /api/vulnerable/product/:id'
            },
            {
                name: 'Expert',
                points: 100,
                hint: 'Faça login como admin sem saber a senha!',
                endpoint: 'POST /api/vulnerable/login'
            }
        ],
        total_points: 185,
        warning: '⚠️ Estas técnicas são ilegais em sistemas sem autorização!'
    });
});

module.exports = router;
