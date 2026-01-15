/**
 * =====================================================
 * GRÃO & CÓDIGO - Rotas com BUGS (Exercícios)
 * =====================================================
 * 
 * 🐛 ATENÇÃO: Estas rotas contêm BUGS PROPOSITAIS!
 * 
 * Estas rotas foram criadas para que os desenvolvedores Junior
 * pratiquem identificação e correção de bugs comuns.
 * 
 * EXERCÍCIO: Identifique e corrija os bugs em cada rota!
 * 
 * Dica: Cada rota tem um comentário BUG indicando
 * aproximadamente onde o bug está localizado.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

/**
 * =====================================================
 * BUG #1: Problema de comparação de tipos
 * =====================================================
 * GET /api/buggy/products
 * 
 * Lista produtos mas tem um bug na verificação de estoque
 * 
 * Comportamento esperado: Produtos com stock = 0 devem mostrar "Esgotado"
 * Comportamento atual: Está mostrando "Em estoque" para todos
 */
router.get('/products', async (req, res) => {
    try {
        const products = await query('SELECT * FROM products WHERE active = TRUE');
        
        const productsWithStatus = products.map(product => {
            /* BUG #1: Comparação errada! */
            // O desenvolvedor usou == ao invés de === e comparou com string
            const inStock = product.stock == '0' ? false : true;
            
            return {
                ...product,
                status: inStock ? 'Em estoque' : 'Esgotado',
                inStock: inStock
            };
        });
        
        res.json({
            success: true,
            bug_hint: '🐛 Bug #1: Por que produtos com estoque 0 mostram "Em estoque"? Verifique a comparação!',
            data: productsWithStatus
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * =====================================================
 * BUG #2: Cálculo incorreto de total
 * =====================================================
 * GET /api/buggy/total/:orderId
 * 
 * Calcula o total do pedido mas está somando errado
 * 
 * Comportamento esperado: Soma (quantidade * preço) de todos os itens
 * Comportamento atual: Está concatenando ao invés de somar
 */
router.get('/total/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const items = await query(
            `SELECT oi.quantity, oi.unit_price, p.name 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [orderId]
        );
        
        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Pedido não encontrado ou sem itens'
            });
        }
        
        /* BUG #2: Variável inicializada com tipo errado! */
        let total = '0'; // Deveria ser número, não string!
        
        const itemsDetail = items.map(item => {
            const subtotal = item.quantity * item.unit_price;
            /* BUG #2 continua: += em string concatena ao invés de somar */
            total += subtotal;
            
            return {
                name: item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: subtotal
            };
        });
        
        res.json({
            success: true,
            bug_hint: '🐛 Bug #2: O total está estranho? Verifique o tipo da variável total!',
            order_id: orderId,
            items: itemsDetail,
            calculated_total: total, // Resultado bugado!
            hint: 'Compare o calculated_total com a soma manual dos subtotais...'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * =====================================================
 * BUG #3: Problema com async/await
 * =====================================================
 * POST /api/buggy/order
 * 
 * Cria um pedido mas não espera as operações assíncronas
 * 
 * Comportamento esperado: Todos os itens devem ser inseridos antes de retornar
 * Comportamento atual: Retorna antes de inserir os itens
 */
router.post('/order', async (req, res) => {
    try {
        const { user_id, items } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Itens são obrigatórios'
            });
        }
        
        // Cria o pedido
        const orderResult = await query(
            'INSERT INTO orders (user_id, total, status) VALUES (?, 0, "pending")',
            [user_id || null]
        );
        
        const orderId = orderResult.insertId;
        let total = 0;
        
        /* BUG #3: forEach com async não espera! */
        items.forEach(async (item) => {
            const [product] = await query(
                'SELECT price FROM products WHERE id = ?',
                [item.product_id]
            );
            
            if (product) {
                const quantity = item.quantity || 1;
                total += product.price * quantity;
                
                await query(
                    'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, quantity, product.price]
                );
            }
        });
        
        // Atualiza o total do pedido
        await query('UPDATE orders SET total = ? WHERE id = ?', [total, orderId]);
        
        res.status(201).json({
            success: true,
            bug_hint: '🐛 Bug #3: Os itens não aparecem no pedido? O total está sempre 0? Problema com forEach async!',
            data: {
                order_id: orderId,
                total: total, // Sempre será 0 por causa do bug!
                items_requested: items.length
            },
            verification: 'Faça GET /api/orders/' + orderId + ' para verificar se os itens foram inseridos'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * =====================================================
 * BUG #4: Off-by-one error (erro de índice)
 * =====================================================
 * GET /api/buggy/ranking
 * 
 * Retorna o ranking dos produtos mais vendidos
 * 
 * Comportamento esperado: Deve pular o primeiro item (índice 0)
 * Comportamento atual: Está acessando índice errado e pode crashar
 */
router.get('/ranking', async (req, res) => {
    try {
        const products = await query(`
            SELECT p.id, p.name, p.price, COALESCE(SUM(oi.quantity), 0) as total_sold
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 5
        `);
        
        /* BUG #4: Loop com índice errado! */
        // O desenvolvedor queria começar do segundo item (índice 1)
        // mas usou <= ao invés de < causando acesso fora do array
        const ranking = [];
        for (let i = 1; i <= products.length; i++) {
            ranking.push({
                position: i,
                /* BUG: products[products.length] é undefined! */
                product: products[i]
            });
        }
        
        res.json({
            success: true,
            bug_hint: '🐛 Bug #4: O último item do ranking está undefined? Verifique o loop!',
            ranking: ranking,
            original_count: products.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * =====================================================
 * BUG #5: Problema com validação de entrada
 * =====================================================
 * POST /api/buggy/discount
 * 
 * Aplica desconto em um produto
 * 
 * Comportamento esperado: Desconto deve ser entre 0 e 100%
 * Comportamento atual: Aceita qualquer valor, inclusive negativos
 */
router.post('/discount', async (req, res) => {
    try {
        const { product_id, discount_percent } = req.body;
        
        if (!product_id) {
            return res.status(400).json({
                success: false,
                error: 'product_id é obrigatório'
            });
        }
        
        const [product] = await query('SELECT * FROM products WHERE id = ?', [product_id]);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado'
            });
        }
        
        /* BUG #5: Sem validação do percentual de desconto! */
        // O código não valida se discount_percent está entre 0 e 100
        // Valores negativos aumentam o preço!
        // Valores > 100 resultam em preço negativo!
        
        const discountedPrice = product.price * (1 - discount_percent / 100);
        
        res.json({
            success: true,
            bug_hint: '🐛 Bug #5: Tente enviar desconto de -50 ou 150. O que acontece com o preço?',
            data: {
                product: product.name,
                original_price: product.price,
                discount_percent: discount_percent,
                discounted_price: discountedPrice, // Pode ser negativo ou maior que o original!
                savings: product.price - discountedPrice
            },
            test_cases: [
                'Tente discount_percent: -50 (aumenta o preço!)',
                'Tente discount_percent: 150 (preço negativo!)',
                'Tente discount_percent: "abc" (NaN!)'
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * =====================================================
 * BUG #6: Problema com escopo de variável
 * =====================================================
 * GET /api/buggy/summary
 * 
 * Retorna resumo de vendas por categoria
 * 
 * Comportamento esperado: Cada categoria com seu total correto
 * Comportamento atual: Todas as categorias mostram o mesmo total
 */
router.get('/summary', async (req, res) => {
    try {
        const categories = await query('SELECT * FROM categories');
        
        /* BUG #6: Variável declarada fora do loop! */
        var categoryTotal = 0; // var tem escopo de função, não de bloco!
        
        const summary = [];
        
        for (const category of categories) {
            const [result] = await query(`
                SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0) as total
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE p.category_id = ?
            `, [category.id]);
            
            /* BUG #6: categoryTotal acumula ao invés de ser resetado */
            categoryTotal += parseFloat(result.total);
            
            summary.push({
                category_id: category.id,
                category_name: category.name,
                total_sales: categoryTotal // Está acumulando!
            });
        }
        
        res.json({
            success: true,
            bug_hint: '🐛 Bug #6: Por que os totais estão acumulando? Verifique o escopo da variável!',
            data: summary
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/buggy
 * Lista todos os bugs disponíveis para correção
 */
router.get('/', (req, res) => {
    res.json({
        title: '🐛 Exercícios de Correção de Bugs',
        description: 'Cada rota abaixo contém um bug proposital. Identifique e corrija!',
        bugs: [
            {
                id: 1,
                name: 'Comparação de Tipos',
                endpoint: 'GET /api/buggy/products',
                difficulty: '⭐ Fácil',
                hint: 'Problema com == vs === e tipos de dados'
            },
            {
                id: 2,
                name: 'Cálculo Incorreto',
                endpoint: 'GET /api/buggy/total/:orderId',
                difficulty: '⭐ Fácil',
                hint: 'String + número = concatenação!'
            },
            {
                id: 3,
                name: 'Async/Await',
                endpoint: 'POST /api/buggy/order',
                difficulty: '⭐⭐ Médio',
                hint: 'forEach não espera promises!'
            },
            {
                id: 4,
                name: 'Off-by-One Error',
                endpoint: 'GET /api/buggy/ranking',
                difficulty: '⭐⭐ Médio',
                hint: 'Cuidado com os limites do array!'
            },
            {
                id: 5,
                name: 'Validação de Entrada',
                endpoint: 'POST /api/buggy/discount',
                difficulty: '⭐ Fácil',
                hint: 'Sempre valide os dados de entrada!'
            },
            {
                id: 6,
                name: 'Escopo de Variável',
                endpoint: 'GET /api/buggy/summary',
                difficulty: '⭐⭐ Médio',
                hint: 'var vs let/const e escopo de bloco'
            }
        ],
        instructions: [
            '1. Teste cada endpoint no Postman',
            '2. Observe o comportamento incorreto',
            '3. Leia o código em src/routes/buggy.js',
            '4. Identifique e corrija o bug',
            '5. Teste novamente para verificar a correção'
        ]
    });
});

module.exports = router;
