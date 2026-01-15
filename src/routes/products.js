/**
 * =====================================================
 * GRÃO & CÓDIGO - Rotas de Produtos
 * =====================================================
 * 🔍 Rotas SEGURAS para exploração com Postman
 * Estas rotas usam prepared statements e são seguras
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

/**
 * GET /api/products
 * Lista todos os produtos com informações de categoria
 * 
 * Query params opcionais:
 * - category: ID da categoria para filtrar
 * - active: true/false para filtrar por status
 * - minPrice: preço mínimo
 * - maxPrice: preço máximo
 */
router.get('/', async (req, res) => {
    try {
        const { category, active, minPrice, maxPrice } = req.query;
        
        let sql = `
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.active,
                p.created_at,
                c.id as category_id,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        
        const params = [];
        
        // Filtro por categoria
        if (category) {
            sql += ' AND p.category_id = ?';
            params.push(category);
        }
        
        // Filtro por status ativo
        if (active !== undefined) {
            sql += ' AND p.active = ?';
            params.push(active === 'true' ? 1 : 0);
        }
        
        // Filtro por preço mínimo
        if (minPrice) {
            sql += ' AND p.price >= ?';
            params.push(parseFloat(minPrice));
        }
        
        // Filtro por preço máximo
        if (maxPrice) {
            sql += ' AND p.price <= ?';
            params.push(parseFloat(maxPrice));
        }
        
        sql += ' ORDER BY p.name ASC';
        
        const products = await query(sql, params);
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/products/:id
 * Busca um produto específico por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const sql = `
            SELECT 
                p.*,
                c.name as category_name,
                c.description as category_description
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        
        const products = await query(sql, [id]);
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: products[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/products
 * Cria um novo produto
 */
router.post('/', async (req, res) => {
    try {
        const { name, description, price, stock, category_id, active } = req.body;
        
        // Validação básica
        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Nome e preço são obrigatórios'
            });
        }
        
        const sql = `
            INSERT INTO products (name, description, price, stock, category_id, active)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const result = await query(sql, [
            name,
            description || null,
            price,
            stock || 0,
            category_id || null,
            active !== undefined ? active : true
        ]);
        
        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            data: {
                id: result.insertId,
                name,
                description,
                price,
                stock: stock || 0,
                category_id,
                active: active !== undefined ? active : true
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
 * PUT /api/products/:id
 * Atualiza um produto existente
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category_id, active } = req.body;
        
        // Verifica se o produto existe
        const [existing] = await query('SELECT id FROM products WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado'
            });
        }
        
        const sql = `
            UPDATE products 
            SET 
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                price = COALESCE(?, price),
                stock = COALESCE(?, stock),
                category_id = COALESCE(?, category_id),
                active = COALESCE(?, active)
            WHERE id = ?
        `;
        
        await query(sql, [name, description, price, stock, category_id, active, id]);
        
        // Busca o produto atualizado
        const [updated] = await query('SELECT * FROM products WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Produto atualizado com sucesso',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/products/:id
 * Remove um produto (soft delete - apenas desativa)
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verifica se o produto existe
        const [existing] = await query('SELECT id, name FROM products WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado'
            });
        }
        
        // Soft delete - apenas desativa
        await query('UPDATE products SET active = FALSE WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: `Produto "${existing.name}" desativado com sucesso`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
