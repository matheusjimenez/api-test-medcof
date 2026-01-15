/**
 * =====================================================
 * GRÃO & CÓDIGO - Rotas de Pedidos
 * =====================================================
 * 🔍 Rotas SEGURAS para exploração com Postman
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

/**
 * GET /api/orders
 * Lista todos os pedidos com resumo
 */
router.get('/', async (req, res) => {
    try {
        const { status, user_id } = req.query;
        
        let sql = `
            SELECT 
                o.id,
                o.total,
                o.status,
                o.notes,
                o.created_at,
                o.updated_at,
                u.id as user_id,
                u.username
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (status) {
            sql += ' AND o.status = ?';
            params.push(status);
        }
        
        if (user_id) {
            sql += ' AND o.user_id = ?';
            params.push(user_id);
        }
        
        sql += ' ORDER BY o.created_at DESC';
        
        const orders = await query(sql, params);
        
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/orders/:id
 * Busca um pedido específico com seus itens
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Busca o pedido
        const [order] = await query(
            `SELECT 
                o.*,
                u.username,
                u.email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?`,
            [id]
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Pedido não encontrado'
            });
        }
        
        // Busca os itens do pedido
        const items = await query(
            `SELECT 
                oi.id,
                oi.quantity,
                oi.unit_price,
                (oi.quantity * oi.unit_price) as subtotal,
                p.id as product_id,
                p.name as product_name,
                p.description as product_description
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?`,
            [id]
        );
        
        res.json({
            success: true,
            data: {
                ...order,
                items
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/orders
 * Cria um novo pedido
 */
router.post('/', async (req, res) => {
    try {
        const { user_id, items, notes } = req.body;
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'É necessário pelo menos um item no pedido'
            });
        }
        
        // Valida os produtos e calcula o total
        let total = 0;
        const validatedItems = [];
        
        for (const item of items) {
            const [product] = await query(
                'SELECT id, name, price, stock FROM products WHERE id = ? AND active = TRUE',
                [item.product_id]
            );
            
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: `Produto com ID ${item.product_id} não encontrado ou inativo`
                });
            }
            
            const quantity = item.quantity || 1;
            const subtotal = product.price * quantity;
            total += subtotal;
            
            validatedItems.push({
                product_id: product.id,
                product_name: product.name,
                quantity,
                unit_price: product.price,
                subtotal
            });
        }
        
        // Cria o pedido
        const orderResult = await query(
            'INSERT INTO orders (user_id, total, notes) VALUES (?, ?, ?)',
            [user_id || null, total, notes || null]
        );
        
        const orderId = orderResult.insertId;
        
        // Cria os itens do pedido
        for (const item of validatedItems) {
            await query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.unit_price]
            );
        }
        
        res.status(201).json({
            success: true,
            message: 'Pedido criado com sucesso',
            data: {
                id: orderId,
                user_id,
                total,
                status: 'pending',
                items: validatedItems
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PATCH /api/orders/:id/status
 * Atualiza o status de um pedido
 */
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
        
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Status inválido. Use: ${validStatuses.join(', ')}`
            });
        }
        
        const [existing] = await query('SELECT id, status FROM orders WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Pedido não encontrado'
            });
        }
        
        await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        
        res.json({
            success: true,
            message: `Status do pedido #${id} atualizado para "${status}"`,
            data: {
                id: parseInt(id),
                old_status: existing.status,
                new_status: status
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/orders/:id
 * Cancela um pedido
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [existing] = await query('SELECT id, status FROM orders WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Pedido não encontrado'
            });
        }
        
        if (existing.status === 'delivered') {
            return res.status(400).json({
                success: false,
                error: 'Não é possível cancelar um pedido já entregue'
            });
        }
        
        await query('UPDATE orders SET status = "cancelled" WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: `Pedido #${id} cancelado com sucesso`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
