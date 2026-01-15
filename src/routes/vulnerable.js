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
 * Flags disponíveis (total: 520 pontos):
 * - Flag{W3lc0m3_t0_SQL_W0rld} - 10 pts (tabela secret_flags)
 * - Flag{SQL_1nj3ct10n_M4st3r} - 25 pts (senha do user suporte_tech)
 * - Flag{Un10n_S3l3ct_Pr0} - 50 pts (tabela secret_flags)
 * - Flag{4dm1n_P4ssw0rd_L34k3d} - 100 pts (bypass login admin)
 * - Flag{4dm1n_4cc3ss_Gr4nt3d} - 75 pts (notes do CTO)
 * - Flag{H0n3yp0t_D3t3ct3d} - 50 pts (user root fake)
 * - Flag{Pr0m0_C0d3_Hunt3r} - 30 pts (tabela promotions)
 * - Flag{Pr0duct_Hunt3r_Pr0} - 40 pts (produto escondido)
 * - Flag{1nf0rm4t10n_Sch3m4} - 60 pts (information_schema)
 * - Flag{4dm1n_N0t3s_F0und} - 80 pts (tabela admin_notes)
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
 * - UNION para listar tabelas: ?q=' UNION SELECT table_name,2,3,4,5,6,7,8,9 FROM information_schema.tables WHERE table_schema='grao_codigo' --
 * - UNION para pegar flags: ?q=' UNION SELECT flag_code,flag_name,hint,points,5,6,7,8,9 FROM secret_flags --
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
        
        // Detecta se conseguiu fazer UNION com outras tabelas
        const possibleFlag = products.some(p => 
            String(p.name).includes('Flag{') || 
            String(p.description).includes('Flag{')
        );
        
        res.json({
            success: true,
            query: searchTerm,
            count: products.length,
            data: products,
            hint: possibleFlag 
                ? '🚩 Parece que você encontrou algo interessante!' 
                : '🚩 Esta rota é vulnerável a SQL Injection. Tente usar payloads especiais no parâmetro q!'
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
 * - Específico para admin: username: admin'/* , password: */--
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
        if (user.role === 'admin' && user.active) {
            res.json({
                success: true,
                message: '🚩 Parabéns! Você conseguiu fazer bypass de autenticação!',
                flag: 'Flag{4dm1n_P4ssw0rd_L34k3d}',
                points: 100,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                    salary: user.salary, // Informação sensível exposta!
                    // Mostra a senha para fins didáticos
                    password_hint: `A senha real era: ${user.password}`
                }
            });
        } else if (user.username === 'root') {
            // Honeypot detectado!
            res.json({
                success: true,
                message: '🚩 Você encontrou o honeypot!',
                flag: 'Flag{H0n3yp0t_D3t3ct3d}',
                points: 50,
                warning: 'Contas como "root" ou "administrator" em sistemas reais são frequentemente armadilhas!',
                data: {
                    id: user.id,
                    username: user.username,
                    password: user.password
                }
            });
        } else {
            res.json({
                success: true,
                message: 'Login realizado',
                hint: users.length > 1 
                    ? `Você retornou ${users.length} usuários! Tente mirar no admin ativo...` 
                    : 'Logado, mas este usuário não é admin. Tente bypassar para um admin!',
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    active: user.active
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
 * - UNION attack: /product/0 UNION SELECT 1,flag_code,flag_name,hint,points,6,7,8,9,10,11,12,13,14,15 FROM secret_flags
 * - Ver usuários: /product/0 UNION SELECT 1,username,password,email,full_name,phone,role,salary,8,9,10,11,12,13,14 FROM users
 * - Ver notas admin: /product/0 UNION SELECT 1,title,content,priority,author,6,7,8,9,10,11,12,13,14,15 FROM admin_notes
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
                p.cost,
                p.stock,
                p.min_stock,
                p.category_id,
                p.sku,
                p.barcode,
                p.active,
                p.featured,
                p.created_at,
                p.updated_at,
                c.name as category_name
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
                hint: 'Tente usar UNION SELECT para combinar com outra tabela... A query tem 15 colunas!'
            });
        }
        
        // Detecta se encontrou dados de outras tabelas
        const possibleInjection = products.some(p => 
            String(p.name).includes('Flag{') || 
            String(p.description).includes('Flag{') ||
            String(p.name).includes('admin') ||
            String(p.description).includes('Backup')
        );
        
        res.json({
            success: true,
            data: products.length === 1 ? products[0] : products,
            hint: possibleInjection
                ? '🚩 Você está no caminho certo! Continue explorando outras tabelas...'
                : '🚩 Esta rota aceita o ID diretamente na query. Experimente UNION SELECT!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            sqlError: error.sqlMessage || null,
            hint: 'O erro pode revelar a estrutura da query! Conte as colunas...'
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
 * - Ver inativos: ?role=' OR active=0 --
 * - UNION attack: ?role=' UNION SELECT id,flag_code,flag_name,hint,points,difficulty,'x' FROM secret_flags --
 */
router.get('/users', async (req, res) => {
    try {
        const { role } = req.query;
        
        let sql = "SELECT id, username, password, email, full_name, role, active, notes FROM users";
        
        if (role) {
            // ⚠️ VULNERÁVEL!
            sql += ` WHERE role = '${role}'`;
        }
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const users = await queryRaw(sql);
        
        // Detecta se conseguiu ver usuários inativos com flags
        const foundSupportFlag = users.some(u => 
            u.username === 'suporte_tech' || 
            (u.password && String(u.password).includes('Flag{'))
        );
        
        const foundHoneypot = users.some(u => u.username === 'root');
        
        const foundCTONotes = users.some(u => 
            u.notes && String(u.notes).includes('Flag{')
        );
        
        let flags = [];
        if (foundSupportFlag) flags.push({ flag: 'Flag{SQL_1nj3ct10n_M4st3r}', points: 25 });
        if (foundHoneypot) flags.push({ flag: 'Flag{H0n3yp0t_D3t3ct3d}', points: 50, hint: 'Encontrado no login!' });
        if (foundCTONotes) flags.push({ flag: 'Flag{4dm1n_4cc3ss_Gr4nt3d}', points: 75 });
        
        res.json({
            success: true,
            count: users.length,
            data: users,
            hint: flags.length > 0
                ? '🚩 Você encontrou dados sensíveis! Procure por senhas e notas interessantes...'
                : 'Use o parâmetro role para filtrar. Ou tente algo mais... criativo! Veja usuários inativos...',
            flags: flags.length > 0 ? flags : undefined
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
 * - Ver colunas: ?sort=1
 */
router.get('/order', async (req, res) => {
    try {
        const { sort } = req.query;
        const orderBy = sort || 'name';
        
        // ⚠️ VULNERÁVEL! ORDER BY injection
        const sql = `SELECT id, name, price, stock, sku FROM products WHERE active = TRUE ORDER BY ${orderBy} LIMIT 20`;
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const products = await queryRaw(sql);
        
        res.json({
            success: true,
            sorted_by: orderBy,
            count: products.length,
            data: products,
            hint: '🚩 O ORDER BY também pode ser explorado! Tente usar números ou subqueries.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            sqlError: error.sqlMessage || null,
            hint: 'Erros podem revelar informações úteis sobre a estrutura!'
        });
    }
});

/**
 * GET /api/vulnerable/promo
 * 🚩 VULNERÁVEL A SQL INJECTION
 * 
 * Busca promoções por código
 * 
 * Exemplos:
 * - Normal: ?code=VIP10
 * - Ver todas: ?code=' OR '1'='1
 * - UNION: ?code=' UNION SELECT * FROM secret_flags --
 */
router.get('/promo', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.json({
                success: true,
                message: 'Informe um código promocional',
                hint: 'Use ?code=CODIGO para buscar. Códigos válidos: VIP10, BEMVINDO20, CORP10...',
                example: '/api/vulnerable/promo?code=VIP10'
            });
        }
        
        // ⚠️ VULNERÁVEL!
        const sql = `SELECT * FROM promotions WHERE code = '${code}'`;
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const promos = await queryRaw(sql);
        
        // Verifica se encontrou a flag escondida
        const foundFlag = promos.some(p => 
            p.code === 'FLAG99' || 
            String(p.name).includes('Flag{')
        );
        
        if (promos.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Código promocional não encontrado',
                hint: 'Tente injetar SQL para ver todos os códigos...'
            });
        }
        
        res.json({
            success: true,
            count: promos.length,
            data: promos,
            flag: foundFlag ? { flag: 'Flag{Pr0m0_C0d3_Hunt3r}', points: 30 } : undefined,
            hint: foundFlag 
                ? '🚩 Você encontrou o código promocional secreto!'
                : 'Há um código promocional escondido com 99% de desconto...'
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
 * GET /api/vulnerable/notes
 * 🚩 VULNERÁVEL A SQL INJECTION
 * 
 * Busca notas por prioridade (tabela escondida!)
 * 
 * Exemplos:
 * - Normal: ?priority=high
 * - Ver todas: ?priority=' OR '1'='1
 */
router.get('/notes', async (req, res) => {
    try {
        const { priority } = req.query;
        
        if (!priority) {
            return res.json({
                success: true,
                message: 'Endpoint de notas internas',
                hint: 'Use ?priority=low|medium|high|critical para filtrar',
                warning: 'Este endpoint não deveria ser público...'
            });
        }
        
        // ⚠️ VULNERÁVEL!
        const sql = `SELECT * FROM admin_notes WHERE priority = '${priority}'`;
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const notes = await queryRaw(sql);
        
        // Verifica se encontrou a flag
        const foundFlag = notes.some(n => 
            String(n.content).includes('Flag{')
        );
        
        res.json({
            success: true,
            count: notes.length,
            data: notes,
            flag: foundFlag ? { flag: 'Flag{4dm1n_N0t3s_F0und}', points: 80 } : undefined,
            hint: foundFlag
                ? '🚩 Você encontrou as notas confidenciais do admin!'
                : 'Há informações sensíveis em notas de prioridade crítica...'
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
 * GET /api/vulnerable/tables
 * 🚩 AJUDA para SQL Injection
 * 
 * Lista tabelas do banco (simulando information_schema)
 */
router.get('/tables', async (req, res) => {
    try {
        const { schema } = req.query;
        const dbName = schema || 'grao_codigo';
        
        // ⚠️ VULNERÁVEL!
        const sql = `SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = '${dbName}'`;
        
        console.log('🔴 [VULNERABLE] Query executada:', sql);
        
        const tables = await queryRaw(sql);
        
        // Flag por explorar information_schema
        const foundHiddenTable = tables.some(t => 
            t.TABLE_NAME === 'admin_notes' || t.TABLE_NAME === 'secret_flags'
        );
        
        res.json({
            success: true,
            database: dbName,
            count: tables.length,
            tables: tables.map(t => t.TABLE_NAME || t.table_name),
            flag: foundHiddenTable ? { flag: 'Flag{1nf0rm4t10n_Sch3m4}', points: 60 } : undefined,
            hint: foundHiddenTable
                ? '🚩 Você descobriu a estrutura do banco! Explore as tabelas interessantes...'
                : 'Use information_schema para descobrir a estrutura do banco de dados'
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
 * GET /api/vulnerable/flags
 * Mostra as flags disponíveis (para referência)
 */
router.get('/flags', (req, res) => {
    res.json({
        title: '🚩 Capture The Flag - SQL Injection Challenge',
        description: 'Encontre todas as flags usando técnicas de SQL Injection!',
        total_flags: 10,
        total_points: 520,
        rules: [
            'Cada flag tem um formato: Flag{xxxxx}',
            'As flags estão escondidas em diferentes locais do banco',
            'Use SQL Injection para encontrá-las',
            'Dicas estão nos hints das respostas',
            'Explore TODAS as tabelas do banco!'
        ],
        challenges: [
            {
                name: '🟢 Bem-vindo ao SQL',
                points: 10,
                difficulty: 'Iniciante',
                hint: 'Há uma tabela chamada secret_flags. Use UNION SELECT na busca!',
                endpoint: 'GET /api/vulnerable/search'
            },
            {
                name: '🟢 Senha Vazada',
                points: 25,
                difficulty: 'Fácil',
                hint: 'Um usuário desativado tem segredos na senha...',
                endpoint: 'GET /api/vulnerable/users'
            },
            {
                name: '🟢 Promo Hunter',
                points: 30,
                difficulty: 'Fácil',
                hint: 'Existe um código promocional secreto com 99% de desconto',
                endpoint: 'GET /api/vulnerable/promo'
            },
            {
                name: '🟡 Produto Escondido',
                points: 40,
                difficulty: 'Fácil',
                hint: 'Há um produto muito caro com um segredo na descrição...',
                endpoint: 'GET /api/vulnerable/search ou /api/products'
            },
            {
                name: '🟡 UNION Master',
                points: 50,
                difficulty: 'Médio',
                hint: 'Use UNION SELECT para extrair dados da tabela secret_flags',
                endpoint: 'GET /api/vulnerable/product/:id'
            },
            {
                name: '🟡 Honeypot Hunter',
                points: 50,
                difficulty: 'Médio',
                hint: 'Nem toda conta de "root" é real...',
                endpoint: 'POST /api/vulnerable/login'
            },
            {
                name: '🟡 Schema Explorer',
                points: 60,
                difficulty: 'Médio',
                hint: 'Use information_schema para mapear o banco de dados',
                endpoint: 'GET /api/vulnerable/tables'
            },
            {
                name: '🟠 Notas do CTO',
                points: 75,
                difficulty: 'Médio',
                hint: 'O CTO deixou uma flag nas notas de um usuário',
                endpoint: 'GET /api/vulnerable/users'
            },
            {
                name: '🟠 Notas Secretas',
                points: 80,
                difficulty: 'Médio-Difícil',
                hint: 'Há uma tabela admin_notes com informações sensíveis',
                endpoint: 'GET /api/vulnerable/notes'
            },
            {
                name: '🔴 Admin Access',
                points: 100,
                difficulty: 'Difícil',
                hint: 'Faça login como admin sem saber a senha!',
                endpoint: 'POST /api/vulnerable/login'
            }
        ],
        endpoints_vulneraveis: [
            'GET /api/vulnerable/search?q=',
            'GET /api/vulnerable/product/:id',
            'GET /api/vulnerable/users?role=',
            'GET /api/vulnerable/order?sort=',
            'GET /api/vulnerable/promo?code=',
            'GET /api/vulnerable/notes?priority=',
            'GET /api/vulnerable/tables?schema=',
            'POST /api/vulnerable/login'
        ],
        dicas_gerais: [
            "Teste com ' (aspas simples) para ver se há erro SQL",
            "Use -- ou # para comentar o resto da query",
            "UNION SELECT requer o mesmo número de colunas",
            "information_schema.tables lista todas as tabelas",
            "Erros SQL revelam estrutura da query",
            "Nem todos os usuários estão ativos..."
        ],
        warning: '⚠️ Estas técnicas são ILEGAIS em sistemas sem autorização!'
    });
});

module.exports = router;
