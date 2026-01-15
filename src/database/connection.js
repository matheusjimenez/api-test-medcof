/**
 * =====================================================
 * GRÃO & CÓDIGO - Conexão com Banco de Dados
 * =====================================================
 * Módulo responsável pela conexão com MySQL
 */

const mysql = require('mysql2/promise');

// Configurações do banco de dados
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'cafeteria',
    password: process.env.DB_PASSWORD || 'cafeteria123',
    database: process.env.DB_NAME || 'grao_codigo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Pool de conexões
let pool = null;

/**
 * Inicializa o pool de conexões com o banco
 */
async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        
        // Testa a conexão
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao banco de dados MySQL');
        connection.release();
        
        return pool;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error.message);
        throw error;
    }
}

/**
 * Retorna o pool de conexões
 */
function getPool() {
    if (!pool) {
        throw new Error('Banco de dados não inicializado. Chame initializeDatabase() primeiro.');
    }
    return pool;
}

/**
 * Executa uma query no banco (SEGURA - usa prepared statements)
 * @param {string} sql - Query SQL com placeholders (?)
 * @param {Array} params - Parâmetros para a query
 */
async function query(sql, params = []) {
    const pool = getPool();
    const [results] = await pool.execute(sql, params);
    return results;
}

/**
 * Executa uma query RAW no banco (INSEGURA - vulnerável a SQL Injection)
 * ⚠️ ATENÇÃO: Esta função é PROPOSITALMENTE VULNERÁVEL para fins educacionais!
 * NUNCA use concatenação de strings em queries SQL em produção!
 * 
 * @param {string} sql - Query SQL completa (sem sanitização)
 */
async function queryRaw(sql) {
    const pool = getPool();
    const [results] = await pool.query(sql);
    return results;
}

/**
 * Fecha todas as conexões do pool
 */
async function closeDatabase() {
    if (pool) {
        await pool.end();
        console.log('🔒 Conexões com o banco de dados encerradas');
    }
}

module.exports = {
    initializeDatabase,
    getPool,
    query,
    queryRaw,
    closeDatabase
};
