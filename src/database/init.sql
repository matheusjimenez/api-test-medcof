-- =====================================================
-- GRÃO & CÓDIGO - Script de Inicialização do Banco
-- Projeto Educacional - Prova Prática para Devs Junior
-- =====================================================

-- Usar o banco de dados
USE grao_codigo;

-- =====================================================
-- CRIAÇÃO DAS TABELAS
-- =====================================================

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabela de Usuários (VULNERÁVEL PROPOSITALMENTE)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL, -- Senhas em texto plano para fins didáticos!
    email VARCHAR(100),
    role ENUM('admin', 'manager', 'barista', 'user') DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabela de Flags (CTF - Capture The Flag)
-- Esta tabela contém as flags secretas para o desafio de SQL Injection
CREATE TABLE IF NOT EXISTS secret_flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flag_code VARCHAR(100) NOT NULL,
    flag_name VARCHAR(50) NOT NULL,
    hint VARCHAR(255),
    points INT DEFAULT 10
);

-- =====================================================
-- POPULAÇÃO DAS TABELAS (SEED DATA)
-- =====================================================

-- Inserir Categorias
INSERT INTO categories (name, description) VALUES
('Bebidas Quentes', 'Cafés, chás e outras bebidas quentes'),
('Bebidas Geladas', 'Frappuccinos, sucos e bebidas refrescantes'),
('Grãos e Pós', 'Cafés em grão e moídos para levar'),
('Doces e Salgados', 'Bolos, cookies e salgados artesanais'),
('Acessórios', 'Canecas, filtros e acessórios para café');

-- Inserir Produtos
INSERT INTO products (name, description, price, stock, category_id, active) VALUES
-- Bebidas Quentes (categoria 1)
('Espresso Clássico', 'Shot de café espresso tradicional italiano', 7.50, 999, 1, TRUE),
('Cappuccino', 'Espresso com leite vaporizado e espuma cremosa', 12.00, 999, 1, TRUE),
('Latte Art', 'Espresso com leite vaporizado e arte especial', 14.00, 999, 1, TRUE),
('Mocha', 'Espresso com chocolate e leite vaporizado', 15.00, 999, 1, TRUE),
('Chá Verde Premium', 'Chá verde importado do Japão', 9.00, 50, 1, TRUE),

-- Bebidas Geladas (categoria 2)
('Frappuccino Caramelo', 'Bebida gelada com café, caramelo e chantilly', 18.00, 999, 2, TRUE),
('Cold Brew', 'Café extraído a frio por 12 horas', 13.00, 999, 2, TRUE),
('Suco de Laranja', 'Suco natural de laranja espremido na hora', 10.00, 30, 2, TRUE),

-- Grãos e Pós (categoria 3)
('Grão Arábica Premium 500g', 'Café em grão origem única da Colômbia', 65.00, 25, 3, TRUE),
('Grão Robusta 500g', 'Café em grão encorpado do Vietnã', 45.00, 30, 3, TRUE),
('Café Moído Especial 250g', 'Blend especial da casa moído na hora', 35.00, 40, 3, TRUE),
('Descafeinado 250g', 'Café descafeinado em grão suave', 40.00, 15, 3, FALSE), -- Produto inativo

-- Doces e Salgados (categoria 4)
('Cookie de Chocolate', 'Cookie artesanal com gotas de chocolate belga', 8.50, 20, 4, TRUE),
('Brownie de Nozes', 'Brownie úmido com nozes crocantes', 12.00, 15, 4, TRUE),
('Croissant de Amêndoas', 'Croissant folhado com recheio de amêndoas', 14.00, 10, 4, TRUE),
('Pão de Queijo', 'Tradicional pão de queijo mineiro (3 unidades)', 9.00, 50, 4, TRUE),
('Bolo de Cenoura', 'Fatia de bolo de cenoura com cobertura de chocolate', 11.00, 8, 4, TRUE),

-- Acessórios (categoria 5)
('Caneca Grão & Código', 'Caneca exclusiva de porcelana 350ml', 45.00, 20, 5, TRUE),
('Filtro de Papel (100un)', 'Filtros de papel para café coado', 18.00, 35, 5, TRUE),
('Prensa Francesa 600ml', 'Prensa francesa em vidro e aço inox', 89.00, 8, 5, TRUE);

-- Inserir Usuários (SENHAS EM TEXTO PLANO - VULNERÁVEL PROPOSITALMENTE!)
INSERT INTO users (username, password, email, role, active) VALUES
('admin', 'admin123', 'admin@graoecodigo.com.br', 'admin', TRUE),
('gerente_maria', 'maria2024', 'maria@graoecodigo.com.br', 'manager', TRUE),
('barista_joao', 'cafezinho', 'joao@graoecodigo.com.br', 'barista', TRUE),
('barista_ana', 'latte123', 'ana@graoecodigo.com.br', 'barista', TRUE),
('cliente_carlos', 'carlos99', 'carlos@email.com', 'user', TRUE),
('cliente_lucia', 'senha123', 'lucia@email.com', 'user', TRUE),
('suporte_tech', 'Flag{SQL_1nj3ct10n_M4st3r}', 'suporte@graoecodigo.com.br', 'admin', FALSE);

-- Inserir Pedidos de Exemplo
INSERT INTO orders (user_id, total, status, notes) VALUES
(5, 27.50, 'delivered', 'Sem açúcar no cappuccino'),
(5, 65.00, 'delivered', NULL),
(6, 22.50, 'delivered', 'Pão de queijo extra quente'),
(6, 45.00, 'ready', NULL),
(4, 18.00, 'preparing', 'Pedido do funcionário'),
(3, 8.50, 'pending', NULL);

-- Inserir Itens dos Pedidos
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
-- Pedido 1 (Carlos)
(1, 2, 1, 12.00), -- 1 Cappuccino
(1, 13, 1, 8.50),  -- 1 Cookie
(1, 1, 1, 7.50),   -- 1 Espresso

-- Pedido 2 (Carlos)
(2, 9, 1, 65.00),  -- 1 Grão Arábica

-- Pedido 3 (Lucia)
(3, 1, 1, 7.50),   -- 1 Espresso
(3, 16, 1, 9.00),  -- 1 Pão de Queijo
(3, 8, 1, 10.00),  -- 1 Suco (erro proposital: preço errado! deveria ser 10, tá 10)

-- Pedido 4 (Lucia)
(4, 10, 1, 45.00), -- 1 Grão Robusta

-- Pedido 5 (Ana - barista)
(5, 6, 1, 18.00),  -- 1 Frappuccino

-- Pedido 6 (João - barista)
(6, 13, 1, 8.50);  -- 1 Cookie

-- Inserir Flags Secretas (CTF)
INSERT INTO secret_flags (flag_code, flag_name, hint, points) VALUES
('Flag{W3lc0m3_t0_SQL_W0rld}', 'Iniciante', 'Tente listar todas as tabelas do banco', 10),
('Flag{SQL_1nj3ct10n_M4st3r}', 'Intermediário', 'Existe um usuário desativado com segredos...', 25),
('Flag{Un10n_S3l3ct_Pr0}', 'Avançado', 'UNION SELECT é seu amigo', 50),
('Flag{4dm1n_P4ssw0rd_L34k3d}', 'Expert', 'Bypass de autenticação concluído', 100);

-- =====================================================
-- FIM DO SCRIPT DE INICIALIZAÇÃO
-- =====================================================
