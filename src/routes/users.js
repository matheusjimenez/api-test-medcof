/**
 * =====================================================
 * GRÃO & CÓDIGO - Rotas de Usuários
 * =====================================================
 * 🔍 Rotas SEGURAS para exploração com Postman
 * ⚠️ Senhas visíveis propositalmente para fins didáticos
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

/**
 * GET /api/users
 * Lista todos os usuários (sem mostrar senha)
 */
router.get('/', async (req, res) => {
    try {
        const { role, active } = req.query;
        
        let sql = `
            SELECT 
                id,
                username,
                email,
                role,
                active,
                created_at
            FROM users
            WHERE 1=1
        `;
        
        const params = [];
        
        if (role) {
            sql += ' AND role = ?';
            params.push(role);
        }
        
        if (active !== undefined) {
            sql += ' AND active = ?';
            params.push(active === 'true' ? 1 : 0);
        }
        
        sql += ' ORDER BY created_at DESC';
        
        const users = await query(sql, params);
        
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/users/:id
 * Busca um usuário específico por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [user] = await query(
            'SELECT id, username, email, role, active, created_at FROM users WHERE id = ?',
            [id]
        );
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        // Busca os pedidos do usuário
        const orders = await query(
            'SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [id]
        );
        
        res.json({
            success: true,
            data: {
                ...user,
                orders
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
 * POST /api/users
 * Cria um novo usuário
 * ⚠️ Senha armazenada em texto plano (INSEGURO - fins didáticos)
 */
router.post('/', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username e password são obrigatórios'
            });
        }
        
        // Verifica se usuário já existe
        const [existing] = await query('SELECT id FROM users WHERE username = ?', [username]);
        
        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Username já existe'
            });
        }
        
        const validRoles = ['admin', 'manager', 'barista', 'user'];
        const userRole = validRoles.includes(role) ? role : 'user';
        
        const result = await query(
            'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
            [username, password, email || null, userRole]
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: {
                id: result.insertId,
                username,
                email,
                role: userRole
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
 * PUT /api/users/:id
 * Atualiza um usuário existente
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, active } = req.body;
        
        const [existing] = await query('SELECT id FROM users WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        await query(
            `UPDATE users SET 
                username = COALESCE(?, username),
                email = COALESCE(?, email),
                role = COALESCE(?, role),
                active = COALESCE(?, active)
            WHERE id = ?`,
            [username, email, role, active, id]
        );
        
        const [updated] = await query(
            'SELECT id, username, email, role, active, created_at FROM users WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Usuário atualizado com sucesso',
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
 * DELETE /api/users/:id
 * Desativa um usuário (soft delete)
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [existing] = await query('SELECT id, username FROM users WHERE id = ?', [id]);
        
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        await query('UPDATE users SET active = FALSE WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: `Usuário "${existing.username}" desativado com sucesso`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
