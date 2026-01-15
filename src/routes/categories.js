/**
 * =====================================================
 * GRÃO & CÓDIGO - Rotas de Categorias
 * =====================================================
 * 🔍 Rotas SEGURAS para exploração com Postman
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

/**
 * GET /api/categories
 * Lista todas as categorias com contagem de produtos
 */
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.id,
                c.name,
                c.description,
                c.created_at,
                COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id AND p.active = TRUE
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        
        const categories = await query(sql);
        
        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/categories/:id
 * Busca uma categoria específica com seus produtos
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Busca a categoria
        const [category] = await query(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );
        
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Categoria não encontrada'
            });
        }
        
        // Busca os produtos da categoria
        const products = await query(
            'SELECT * FROM products WHERE category_id = ? AND active = TRUE ORDER BY name',
            [id]
        );
        
        res.json({
            success: true,
            data: {
                ...category,
                products
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
 * POST /api/categories
 * Cria uma nova categoria
 */
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Nome da categoria é obrigatório'
            });
        }
        
        const result = await query(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description || null]
        );
        
        res.status(201).json({
            success: true,
            message: 'Categoria criada com sucesso',
            data: {
                id: result.insertId,
                name,
                description
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
 * PUT /api/categories/:id
 * Atualiza uma categoria existente
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const [existing] = await query('SELECT id FROM categories WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Categoria não encontrada'
            });
        }
        
        await query(
            'UPDATE categories SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
            [name, description, id]
        );
        
        const [updated] = await query('SELECT * FROM categories WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Categoria atualizada com sucesso',
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
 * DELETE /api/categories/:id
 * Remove uma categoria (apenas se não houver produtos)
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [existing] = await query('SELECT * FROM categories WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Categoria não encontrada'
            });
        }
        
        // Verifica se há produtos na categoria
        const [productCount] = await query(
            'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
            [id]
        );
        
        if (productCount.count > 0) {
            return res.status(400).json({
                success: false,
                error: `Não é possível excluir. Existem ${productCount.count} produto(s) nesta categoria.`
            });
        }
        
        await query('DELETE FROM categories WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: `Categoria "${existing.name}" removida com sucesso`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
