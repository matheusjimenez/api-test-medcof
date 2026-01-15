/**
 * =====================================================
 * GRÃO & CÓDIGO - Rotas de Autenticação
 * =====================================================
 * 🔍 Rotas SEGURAS para exploração com Postman
 * (A versão vulnerável está em /api/vulnerable)
 */

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

/**
 * POST /api/auth/login
 * Realiza login de forma SEGURA (usando prepared statements)
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username e password são obrigatórios'
            });
        }
        
        // Query SEGURA usando prepared statements
        const users = await query(
            'SELECT id, username, email, role, active FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Credenciais inválidas'
            });
        }
        
        const user = users[0];
        
        if (!user.active) {
            return res.status(401).json({
                success: false,
                error: 'Usuário desativado'
            });
        }
        
        // Em um sistema real, geraria um JWT token aqui
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                // Token fake para simulação
                token: `fake-jwt-token-${user.id}-${Date.now()}`
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
 * POST /api/auth/register
 * Registra um novo usuário
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username e password são obrigatórios'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password deve ter pelo menos 6 caracteres'
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
        
        // Cria o usuário (senha em texto plano - INSEGURO, apenas para fins didáticos)
        const result = await query(
            'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
            [username, password, email || null, 'user']
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            data: {
                id: result.insertId,
                username,
                email,
                role: 'user'
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
 * GET /api/auth/me
 * Retorna informações do usuário logado (simulação)
 */
router.get('/me', async (req, res) => {
    // Em um sistema real, pegaria o user_id do token JWT
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Token não fornecido',
            hint: 'Envie o header: Authorization: Bearer <token>'
        });
    }
    
    // Extrai o ID do token fake
    const token = authHeader.split(' ')[1];
    const match = token.match(/fake-jwt-token-(\d+)-/);
    
    if (!match) {
        return res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
    
    const userId = match[1];
    
    try {
        const [user] = await query(
            'SELECT id, username, email, role, active, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
