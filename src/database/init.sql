-- =====================================================
-- ☕ GRÃO & CÓDIGO - Script de Inicialização do Banco
-- =====================================================
-- Projeto Educacional - Prova Prática para Devs Junior
-- 
-- Este script cria todas as tabelas e popula com dados
-- realistas para testes e experimentação.
--
-- ⚠️ AVISO: Contém vulnerabilidades PROPOSITAIS!
-- =====================================================

USE grao_codigo;

-- =====================================================
-- LIMPEZA (caso execute múltiplas vezes)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS secret_flags;
DROP TABLE IF EXISTS admin_notes;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- CRIAÇÃO DAS TABELAS
-- =====================================================

-- Tabela de Categorias
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon VARCHAR(50) DEFAULT '☕',
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Produtos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0, -- Custo para cálculo de margem
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5, -- Estoque mínimo para alerta
    category_id INT,
    sku VARCHAR(50), -- Código do produto
    barcode VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE, -- Produto em destaque
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_active (active),
    INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Usuários (VULNERÁVEL PROPOSITALMENTE)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL, -- ⚠️ Senhas em texto plano para fins didáticos!
    email VARCHAR(100),
    full_name VARCHAR(150),
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'barista', 'cashier', 'user') DEFAULT 'user',
    salary DECIMAL(10, 2) DEFAULT 0, -- Informação sensível!
    hire_date DATE,
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    notes TEXT, -- Notas internas (podem conter informações sensíveis)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Pedidos
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL, -- Número amigável do pedido
    user_id INT,
    customer_name VARCHAR(100), -- Para pedidos sem cadastro
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_method ENUM('cash', 'credit', 'debit', 'pix', 'voucher') DEFAULT 'cash',
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    table_number INT,
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at),
    UNIQUE INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    notes VARCHAR(255), -- Observações do item (ex: "sem açúcar")
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Promoções
CREATE TABLE promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type ENUM('percent', 'fixed') DEFAULT 'percent',
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0,
    code VARCHAR(50), -- Código promocional
    start_date DATE,
    end_date DATE,
    usage_limit INT DEFAULT NULL,
    times_used INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Logs de Auditoria (para rastrear ações)
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Flags Secretas (CTF - Capture The Flag)
-- Esta tabela contém as flags secretas para o desafio de SQL Injection
CREATE TABLE secret_flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flag_code VARCHAR(100) NOT NULL,
    flag_name VARCHAR(50) NOT NULL,
    hint VARCHAR(255),
    points INT DEFAULT 10,
    difficulty ENUM('beginner', 'easy', 'medium', 'hard', 'expert') DEFAULT 'easy',
    found_by VARCHAR(100) DEFAULT NULL,
    found_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Notas do Admin (escondida - para CTF)
CREATE TABLE admin_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    author VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- POPULAÇÃO DAS TABELAS (SEED DATA)
-- =====================================================

-- =====================================================
-- CATEGORIAS
-- =====================================================
INSERT INTO categories (name, description, icon, display_order) VALUES
('Bebidas Quentes', 'Cafés, chás e outras bebidas quentes para aquecer seu dia', '☕', 1),
('Bebidas Geladas', 'Frappuccinos, smoothies, sucos e bebidas refrescantes', '🧊', 2),
('Cafés Especiais', 'Métodos especiais de preparo: V60, Chemex, Aeropress', '✨', 3),
('Grãos e Pós', 'Cafés em grão e moídos para levar para casa', '🫘', 4),
('Doces', 'Bolos, tortas, cookies e sobremesas artesanais', '🍰', 5),
('Salgados', 'Pães, croissants e salgados para acompanhar seu café', '🥐', 6),
('Vegano', 'Opções 100% vegetais para todos os gostos', '🌱', 7),
('Acessórios', 'Canecas, filtros, prensas e equipamentos para café', '🛒', 8),
('Combos', 'Combinações especiais com desconto', '🎁', 9),
('Temporários', 'Produtos sazonais e edições limitadas', '⏰', 10);

-- =====================================================
-- PRODUTOS
-- =====================================================

-- Bebidas Quentes (categoria 1)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Espresso Clássico', 'Shot único de café espresso tradicional italiano. Intenso e encorpado.', 7.50, 1.50, 999, 10, 1, 'BQ-001', FALSE),
('Espresso Duplo', 'Dose dupla de espresso para quem precisa de mais energia', 10.00, 2.50, 999, 10, 1, 'BQ-002', FALSE),
('Cappuccino Tradicional', 'Espresso com leite vaporizado e espuma cremosa na medida certa', 12.00, 3.00, 999, 10, 1, 'BQ-003', TRUE),
('Cappuccino com Canela', 'Nosso cappuccino clássico finalizado com canela em pó', 13.00, 3.20, 999, 10, 1, 'BQ-004', FALSE),
('Latte', 'Espresso suave com muito leite vaporizado', 11.00, 2.80, 999, 10, 1, 'BQ-005', FALSE),
('Latte Art', 'Latte com arte especial na espuma - perfeito para fotos!', 14.00, 3.50, 999, 10, 1, 'BQ-006', TRUE),
('Latte de Caramelo', 'Latte com calda de caramelo artesanal', 15.00, 3.80, 999, 10, 1, 'BQ-007', FALSE),
('Latte de Baunilha', 'Latte com essência de baunilha de Madagascar', 15.00, 3.80, 999, 10, 1, 'BQ-008', FALSE),
('Mocha', 'Espresso com chocolate belga e leite vaporizado', 15.00, 4.00, 999, 10, 1, 'BQ-009', TRUE),
('Mocha Branco', 'Mocha preparado com chocolate branco premium', 16.00, 4.50, 999, 10, 1, 'BQ-010', FALSE),
('Macchiato', 'Espresso "manchado" com uma dose de espuma de leite', 9.00, 2.00, 999, 10, 1, 'BQ-011', FALSE),
('Americano', 'Espresso diluído em água quente - suave e aromático', 8.00, 1.80, 999, 10, 1, 'BQ-012', FALSE),
('Café Coado', 'Café filtrado na hora com grãos selecionados', 6.00, 1.20, 999, 10, 1, 'BQ-013', FALSE),
('Chá Verde Premium', 'Chá verde importado do Japão com notas florais', 9.00, 2.50, 50, 10, 1, 'BQ-014', FALSE),
('Chá de Camomila', 'Chá de camomila orgânica para relaxar', 8.00, 2.00, 50, 10, 1, 'BQ-015', FALSE),
('Chá Earl Grey', 'Chá preto com bergamota - clássico inglês', 9.00, 2.30, 50, 10, 1, 'BQ-016', FALSE),
('Chocolate Quente', 'Chocolate quente cremoso com cacau 70%', 12.00, 3.50, 999, 10, 1, 'BQ-017', FALSE),
('Chocolate Quente com Marshmallow', 'Nosso chocolate quente com mini marshmallows', 14.00, 4.00, 999, 10, 1, 'BQ-018', FALSE);

-- Bebidas Geladas (categoria 2)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Café Gelado', 'Espresso resfriado servido com gelo', 10.00, 2.00, 999, 10, 2, 'BG-001', FALSE),
('Cold Brew', 'Café extraído a frio por 12 horas - suave e refrescante', 13.00, 3.00, 999, 10, 2, 'BG-002', TRUE),
('Cold Brew com Tônica', 'Cold brew com água tônica e limão siciliano', 16.00, 4.00, 999, 10, 2, 'BG-003', FALSE),
('Frappuccino Mocha', 'Bebida gelada cremosa com café, chocolate e chantilly', 18.00, 5.00, 999, 10, 2, 'BG-004', TRUE),
('Frappuccino Caramelo', 'Frappuccino com calda de caramelo e cobertura', 18.00, 5.00, 999, 10, 2, 'BG-005', FALSE),
('Frappuccino Cookies', 'Frappuccino com pedaços de cookie e chocolate', 19.00, 5.50, 999, 10, 2, 'BG-006', FALSE),
('Smoothie de Frutas Vermelhas', 'Blend de morango, amora e framboesa', 16.00, 5.00, 50, 10, 2, 'BG-007', FALSE),
('Smoothie Verde Detox', 'Couve, espinafre, maçã verde e gengibre', 15.00, 4.50, 50, 10, 2, 'BG-008', FALSE),
('Smoothie de Açaí', 'Açaí batido com banana e granola', 18.00, 6.00, 30, 10, 2, 'BG-009', FALSE),
('Suco de Laranja Natural', 'Suco de laranja espremido na hora', 10.00, 3.00, 30, 10, 2, 'BG-010', FALSE),
('Suco Verde', 'Laranja, couve, maçã e limão', 12.00, 4.00, 30, 10, 2, 'BG-011', FALSE),
('Limonada Suíça', 'Limão batido com leite condensado e gelo', 11.00, 3.00, 999, 10, 2, 'BG-012', FALSE),
('Chá Gelado de Pêssego', 'Chá preto gelado com pêssego', 10.00, 2.50, 50, 10, 2, 'BG-013', FALSE),
('Água de Coco', 'Água de coco natural gelada', 8.00, 3.00, 20, 10, 2, 'BG-014', FALSE),
('Milkshake de Chocolate', 'Milkshake cremoso de chocolate belga', 16.00, 5.00, 999, 10, 2, 'BG-015', FALSE),
('Milkshake de Morango', 'Milkshake com morangos frescos', 16.00, 5.00, 999, 10, 2, 'BG-016', FALSE),
('Affogato', 'Sorvete de creme com shot de espresso', 14.00, 4.00, 999, 10, 2, 'BG-017', TRUE);

-- Cafés Especiais (categoria 3)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('V60 - Etiópia Yirgacheffe', 'Café etíope com notas florais e cítricas, preparado na Hario V60', 18.00, 6.00, 999, 5, 3, 'CE-001', TRUE),
('V60 - Brasil Cerrado', 'Café brasileiro com notas de chocolate e nozes', 16.00, 5.00, 999, 5, 3, 'CE-002', FALSE),
('Chemex - Colômbia Huila', 'Café colombiano suave e equilibrado na Chemex', 22.00, 7.00, 999, 5, 3, 'CE-003', TRUE),
('Chemex - Guatemala Antigua', 'Notas de frutas vermelhas e caramelo', 24.00, 8.00, 999, 5, 3, 'CE-004', FALSE),
('Aeropress - Quênia AA', 'Café queniano intenso com acidez vibrante', 20.00, 6.50, 999, 5, 3, 'CE-005', FALSE),
('French Press - Blend da Casa', 'Nosso blend especial na prensa francesa', 15.00, 4.50, 999, 5, 3, 'CE-006', FALSE),
('Siphon - Japão Premium', 'Café japonês preparado no sifão - experiência única', 35.00, 12.00, 50, 5, 3, 'CE-007', TRUE),
('Turkish Coffee', 'Café turco tradicional com cardamomo', 12.00, 3.00, 999, 5, 3, 'CE-008', FALSE);

-- Grãos e Pós (categoria 4)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Grão Arábica Premium 250g', 'Café em grão 100% arábica da Colômbia, torra média', 35.00, 15.00, 50, 10, 4, 'GP-001', TRUE),
('Grão Arábica Premium 500g', 'Café em grão 100% arábica da Colômbia, torra média', 65.00, 28.00, 40, 10, 4, 'GP-002', FALSE),
('Grão Arábica Premium 1kg', 'Café em grão 100% arábica da Colômbia, torra média', 120.00, 52.00, 25, 5, 4, 'GP-003', FALSE),
('Grão Robusta 500g', 'Café robusta encorpado do Vietnã - ideal para espresso', 45.00, 18.00, 30, 10, 4, 'GP-004', FALSE),
('Blend da Casa 250g', 'Nossa mistura exclusiva de arábica e robusta', 32.00, 12.00, 60, 15, 4, 'GP-005', TRUE),
('Blend da Casa 500g', 'Nossa mistura exclusiva de arábica e robusta', 58.00, 22.00, 45, 10, 4, 'GP-006', FALSE),
('Café Moído Tradicional 250g', 'Café moído na hora, torra média, para coador', 28.00, 10.00, 40, 10, 4, 'GP-007', FALSE),
('Café Moído Extraforte 250g', 'Café moído torra escura, sabor intenso', 30.00, 11.00, 35, 10, 4, 'GP-008', FALSE),
('Descafeinado em Grão 250g', 'Café descafeinado 99.9% sem cafeína', 42.00, 18.00, 20, 5, 4, 'GP-009', FALSE),
('Etiópia Yirgacheffe 250g', 'Café especial de origem única - pontuação 86+', 55.00, 25.00, 15, 5, 4, 'GP-010', TRUE),
('Geisha Panamá 100g', 'Café raríssimo e premiado - edição limitada', 180.00, 90.00, 5, 2, 4, 'GP-011', TRUE),
('Kit Degustação 4x50g', 'Kit com 4 cafés diferentes para experimentar', 45.00, 18.00, 20, 5, 4, 'GP-012', FALSE);

-- Doces (categoria 5)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Cookie de Chocolate', 'Cookie artesanal com gotas de chocolate belga 70%', 8.50, 2.50, 30, 10, 5, 'DO-001', TRUE),
('Cookie de Aveia e Mel', 'Cookie integral com aveia, mel e passas', 7.50, 2.00, 25, 10, 5, 'DO-002', FALSE),
('Cookie Red Velvet', 'Cookie vermelho com recheio de cream cheese', 9.00, 3.00, 20, 10, 5, 'DO-003', FALSE),
('Brownie Tradicional', 'Brownie de chocolate intenso com casquinha crocante', 10.00, 3.00, 20, 10, 5, 'DO-004', TRUE),
('Brownie de Nozes', 'Brownie com nozes pecan caramelizadas', 12.00, 4.00, 15, 8, 5, 'DO-005', FALSE),
('Brownie de Doce de Leite', 'Brownie com swirl de doce de leite', 12.00, 4.00, 15, 8, 5, 'DO-006', FALSE),
('Bolo de Cenoura', 'Fatia de bolo de cenoura fofinho com cobertura de chocolate', 11.00, 3.50, 12, 6, 5, 'DO-007', FALSE),
('Bolo de Chocolate', 'Fatia de bolo de chocolate recheado', 12.00, 4.00, 12, 6, 5, 'DO-008', TRUE),
('Bolo de Limão', 'Fatia de bolo de limão siciliano com glacê', 11.00, 3.50, 10, 6, 5, 'DO-009', FALSE),
('Cheesecake NY Style', 'Fatia de cheesecake cremoso estilo Nova York', 16.00, 6.00, 8, 4, 5, 'DO-010', TRUE),
('Cheesecake de Frutas Vermelhas', 'Cheesecake com calda de frutas vermelhas', 18.00, 7.00, 8, 4, 5, 'DO-011', FALSE),
('Torta de Maçã', 'Fatia de torta de maçã com canela e sorvete', 15.00, 5.00, 6, 4, 5, 'DO-012', FALSE),
('Pudim de Leite', 'Pudim de leite condensado tradicional', 9.00, 2.50, 10, 5, 5, 'DO-013', FALSE),
('Mousse de Chocolate', 'Mousse aerado de chocolate meio amargo', 12.00, 4.00, 8, 4, 5, 'DO-014', FALSE),
('Petit Gâteau', 'Bolinho de chocolate com centro derretido e sorvete', 22.00, 8.00, 10, 5, 5, 'DO-015', TRUE),
('Tiramisù', 'Clássico italiano com mascarpone e café', 18.00, 6.50, 6, 3, 5, 'DO-016', FALSE),
('Palha Italiana', 'Doce de brigadeiro com biscoito (3 unidades)', 8.00, 2.00, 20, 10, 5, 'DO-017', FALSE),
('Brigadeiro Gourmet', 'Brigadeiro cremoso (unidade)', 5.00, 1.00, 30, 15, 5, 'DO-018', FALSE);

-- Salgados (categoria 6)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Pão de Queijo', 'Tradicional pão de queijo mineiro quentinho (3 unidades)', 9.00, 2.50, 50, 20, 6, 'SA-001', TRUE),
('Pão de Queijo Recheado', 'Pão de queijo recheado com requeijão (2 unidades)', 12.00, 4.00, 30, 15, 6, 'SA-002', FALSE),
('Croissant Natural', 'Croissant folhado amanteigado', 10.00, 3.00, 20, 10, 6, 'SA-003', FALSE),
('Croissant de Chocolate', 'Croissant recheado com chocolate', 12.00, 4.00, 15, 8, 6, 'SA-004', FALSE),
('Croissant de Amêndoas', 'Croissant com recheio e cobertura de amêndoas', 14.00, 5.00, 12, 6, 6, 'SA-005', TRUE),
('Croissant Misto', 'Croissant com presunto e queijo', 14.00, 5.00, 15, 8, 6, 'SA-006', FALSE),
('Muffin Salgado de Queijo', 'Muffin de queijo parmesão', 8.00, 2.50, 20, 10, 6, 'SA-007', FALSE),
('Muffin de Tomate Seco', 'Muffin com tomate seco e manjericão', 9.00, 3.00, 15, 8, 6, 'SA-008', FALSE),
('Quiche de Alho-Poró', 'Fatia de quiche cremoso de alho-poró', 14.00, 5.00, 8, 4, 6, 'SA-009', FALSE),
('Quiche Lorraine', 'Quiche clássico de bacon e queijo', 14.00, 5.00, 8, 4, 6, 'SA-010', TRUE),
('Empada de Frango', 'Empada artesanal recheada com frango', 8.00, 2.50, 20, 10, 6, 'SA-011', FALSE),
('Empada de Palmito', 'Empada com recheio de palmito', 8.00, 2.50, 15, 10, 6, 'SA-012', FALSE),
('Coxinha Gourmet', 'Coxinha crocante recheada com frango desfiado', 9.00, 3.00, 20, 10, 6, 'SA-013', FALSE),
('Sanduíche Natural de Frango', 'Sanduíche no pão integral com frango, cenoura e maionese', 16.00, 6.00, 10, 5, 6, 'SA-014', FALSE),
('Sanduíche Caprese', 'Ciabatta com muçarela de búfala, tomate e manjericão', 18.00, 7.00, 10, 5, 6, 'SA-015', FALSE),
('Wrap de Vegetais', 'Wrap integral com legumes grelhados e homus', 15.00, 5.50, 10, 5, 6, 'SA-016', FALSE),
('Focaccia de Alecrim', 'Pão italiano com azeite e alecrim', 8.00, 2.50, 15, 8, 6, 'SA-017', FALSE),
('Tábua de Frios', 'Seleção de queijos e embutidos com torradas', 45.00, 20.00, 5, 3, 6, 'SA-018', FALSE);

-- Vegano (categoria 7)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Leite de Aveia Extra', 'Adicional de leite de aveia em qualquer bebida', 4.00, 1.50, 999, 10, 7, 'VG-001', FALSE),
('Leite de Amêndoas Extra', 'Adicional de leite de amêndoas', 5.00, 2.00, 999, 10, 7, 'VG-002', FALSE),
('Leite de Coco Extra', 'Adicional de leite de coco', 4.50, 1.80, 999, 10, 7, 'VG-003', FALSE),
('Cappuccino Vegano', 'Cappuccino com leite de aveia e espuma', 14.00, 4.00, 999, 10, 7, 'VG-004', TRUE),
('Latte Vegano', 'Latte com leite vegetal à sua escolha', 13.00, 3.50, 999, 10, 7, 'VG-005', FALSE),
('Mocha Vegano', 'Mocha com chocolate 70% e leite de aveia', 17.00, 5.00, 999, 10, 7, 'VG-006', FALSE),
('Smoothie Bowl Açaí Vegano', 'Bowl de açaí com granola e frutas sem mel', 20.00, 7.00, 20, 8, 7, 'VG-007', TRUE),
('Cookie Vegano de Chocolate', 'Cookie sem ingredientes de origem animal', 10.00, 3.50, 20, 10, 7, 'VG-008', FALSE),
('Brownie Vegano', 'Brownie de chocolate sem lácteos nem ovos', 12.00, 4.50, 15, 8, 7, 'VG-009', FALSE),
('Bolo de Banana Vegano', 'Bolo de banana com canela sem ingredientes animais', 10.00, 3.50, 10, 5, 7, 'VG-010', FALSE),
('Sanduíche Vegano', 'Pão integral com homus, vegetais e tofu grelhado', 18.00, 7.00, 10, 5, 7, 'VG-011', FALSE),
('Wrap Falafel', 'Wrap com falafel, tabule e molho tahine', 17.00, 6.50, 10, 5, 7, 'VG-012', FALSE);

-- Acessórios (categoria 8)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Caneca Grão & Código 350ml', 'Caneca de porcelana exclusiva com logo', 45.00, 15.00, 30, 10, 8, 'AC-001', TRUE),
('Caneca Térmica 500ml', 'Caneca térmica de aço inox - mantém quente por 6h', 89.00, 35.00, 20, 5, 8, 'AC-002', FALSE),
('Copo Reutilizável 450ml', 'Copo para bebidas quentes ou frias, com tampa', 35.00, 12.00, 25, 10, 8, 'AC-003', FALSE),
('Filtro de Papel Hario (100un)', 'Filtros de papel para Hario V60 02', 25.00, 10.00, 40, 15, 8, 'AC-004', FALSE),
('Filtro de Papel Chemex (100un)', 'Filtros branqueados para Chemex 6 xícaras', 55.00, 25.00, 20, 8, 8, 'AC-005', FALSE),
('Hario V60 02 Cerâmica', 'Coador V60 tamanho 02 em cerâmica branca', 120.00, 55.00, 10, 3, 8, 'AC-006', TRUE),
('Chemex 6 Xícaras', 'Cafeteira Chemex clássica para 6 xícaras', 320.00, 150.00, 5, 2, 8, 'AC-007', FALSE),
('Prensa Francesa 600ml', 'French press em vidro e aço inox', 89.00, 35.00, 12, 5, 8, 'AC-008', FALSE),
('Prensa Francesa 1L', 'French press grande para família', 120.00, 50.00, 8, 3, 8, 'AC-009', FALSE),
('Moedor Manual Hario', 'Moedor de café manual com ajuste de moagem', 250.00, 120.00, 8, 3, 8, 'AC-010', TRUE),
('Balança Digital de Precisão', 'Balança para café com precisão de 0.1g', 180.00, 80.00, 10, 3, 8, 'AC-011', FALSE),
('Chaleira Bico de Ganso', 'Chaleira elétrica com controle de temperatura', 350.00, 160.00, 5, 2, 8, 'AC-012', FALSE),
('Kit Barista Iniciante', 'V60 + filtros + moedor manual + 250g de café', 380.00, 180.00, 10, 3, 8, 'AC-013', TRUE),
('Aeropress Original', 'Cafeteira Aeropress com acessórios', 280.00, 130.00, 8, 3, 8, 'AC-014', FALSE),
('Tampinha Reutilizável', 'Tampa de silicone para copos take-away', 12.00, 4.00, 50, 20, 8, 'AC-015', FALSE);

-- Combos (categoria 9)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Combo Café da Manhã', 'Cappuccino + Croissant + Suco de Laranja', 28.00, 10.00, 999, 10, 9, 'CB-001', TRUE),
('Combo Lanche da Tarde', 'Café Coado + Bolo de Cenoura', 15.00, 5.00, 999, 10, 9, 'CB-002', FALSE),
('Combo Doce', 'Chocolate Quente + 2 Cookies', 22.00, 7.00, 999, 10, 9, 'CB-003', FALSE),
('Combo Energia', 'Espresso Duplo + Brownie', 18.00, 6.00, 999, 10, 9, 'CB-004', FALSE),
('Combo Vegano', 'Latte Vegano + Cookie Vegano', 20.00, 7.00, 999, 10, 9, 'CB-005', FALSE),
('Combo Família', '4 Cafés Coados + 8 Pães de Queijo', 38.00, 12.00, 999, 10, 9, 'CB-006', TRUE),
('Combo Especial', 'V60 + Cheesecake', 30.00, 11.00, 999, 10, 9, 'CB-007', FALSE),
('Combo Happy Hour', '2 Frappuccinos + 4 Cookies', 45.00, 15.00, 999, 10, 9, 'CB-008', FALSE);

-- Temporários (categoria 10)
INSERT INTO products (name, description, price, cost, stock, min_stock, category_id, sku, featured) VALUES
('Latte de Panetone', '🎄 Edição de Natal - Latte com especiarias e panetone', 18.00, 5.00, 50, 10, 10, 'TP-001', TRUE),
('Mocha de Menta', '🎄 Edição de Natal - Mocha com toque de menta', 17.00, 5.00, 50, 10, 10, 'TP-002', FALSE),
('Cookie de Gengibre', '🎄 Edição de Natal - Cookie tradicional com especiarias', 9.00, 3.00, 30, 10, 10, 'TP-003', FALSE),
('Hot Toddy Coffee', '❄️ Inverno - Café com mel, limão e especiarias', 16.00, 4.50, 999, 10, 10, 'TP-004', FALSE),
('Pumpkin Spice Latte', '🎃 Outono - Latte com abóbora e especiarias', 17.00, 5.00, 0, 10, 10, 'TP-005', FALSE), -- Produto esgotado!

-- Produto secreto (para CTF)
('Flag Coffee Special', 'Café especial com um segredo... Flag{Pr0duct_Hunt3r_Pr0}', 999.99, 0.00, 1, 1, 10, 'FLAG-001', FALSE);

-- =====================================================
-- USUÁRIOS
-- =====================================================
-- ⚠️ SENHAS EM TEXTO PLANO - VULNERÁVEL PROPOSITALMENTE!

INSERT INTO users (username, password, email, full_name, phone, role, salary, hire_date, active, notes) VALUES
-- Administradores
('admin', 'admin123', 'admin@graoecodigo.com.br', 'Administrador do Sistema', '11999990000', 'admin', 15000.00, '2020-01-01', TRUE, 'Conta principal do sistema. Acesso total.'),
('cto_rafael', 'r4f43l_s3cr3t', 'rafael@graoecodigo.com.br', 'Rafael Oliveira', '11999991111', 'admin', 18000.00, '2020-01-15', TRUE, 'CTO da empresa. Flag{4dm1n_4cc3ss_Gr4nt3d}'),

-- Gerentes
('gerente_maria', 'maria2024!', 'maria@graoecodigo.com.br', 'Maria Santos', '11988880001', 'manager', 8500.00, '2021-03-10', TRUE, 'Gerente da filial Centro'),
('gerente_pedro', 'pedro@123', 'pedro@graoecodigo.com.br', 'Pedro Almeida', '11988880002', 'manager', 8500.00, '2021-06-15', TRUE, 'Gerente da filial Shopping'),
('gerente_lucia', 'lucia456', 'lucia@graoecodigo.com.br', 'Lucia Ferreira', '11988880003', 'manager', 8000.00, '2022-01-10', TRUE, 'Gerente de operações'),

-- Baristas
('barista_joao', 'cafezinho', 'joao@graoecodigo.com.br', 'João Silva', '11977770001', 'barista', 3200.00, '2022-02-01', TRUE, 'Barista sênior, especialista em latte art'),
('barista_ana', 'latte123', 'ana@graoecodigo.com.br', 'Ana Costa', '11977770002', 'barista', 3000.00, '2022-04-15', TRUE, 'Barista pleno'),
('barista_carlos', 'espresso99', 'carlos.b@graoecodigo.com.br', 'Carlos Mendes', '11977770003', 'barista', 2800.00, '2022-08-01', TRUE, 'Barista júnior'),
('barista_julia', 'julia2023', 'julia@graoecodigo.com.br', 'Julia Ribeiro', '11977770004', 'barista', 2800.00, '2023-01-10', TRUE, 'Barista júnior'),
('barista_lucas', 'lucas!cafe', 'lucas@graoecodigo.com.br', 'Lucas Oliveira', '11977770005', 'barista', 3000.00, '2022-06-01', TRUE, 'Barista pleno'),
('barista_mariana', 'mariana321', 'mariana@graoecodigo.com.br', 'Mariana Lima', '11977770006', 'barista', 2800.00, '2023-03-15', FALSE, 'Desligada em 2024-01'),

-- Caixas
('caixa_roberto', 'rob3rto', 'roberto@graoecodigo.com.br', 'Roberto Gomes', '11966660001', 'cashier', 2500.00, '2022-05-01', TRUE, 'Caixa turno manhã'),
('caixa_fernanda', 'fern@nda', 'fernanda@graoecodigo.com.br', 'Fernanda Souza', '11966660002', 'cashier', 2500.00, '2022-07-15', TRUE, 'Caixa turno tarde'),
('caixa_diego', 'di3g0123', 'diego@graoecodigo.com.br', 'Diego Martins', '11966660003', 'cashier', 2500.00, '2023-02-01', TRUE, 'Caixa turno noite'),

-- Clientes
('cliente_carlos', 'carlos99', 'carlos@email.com', 'Carlos Eduardo', '11955550001', 'user', 0, NULL, TRUE, 'Cliente VIP - 10% desconto'),
('cliente_lucia', 'senha123', 'lucia@email.com', 'Lucia Maria', '11955550002', 'user', 0, NULL, TRUE, 'Cliente desde 2022'),
('cliente_marcos', 'marcos456', 'marcos@email.com', 'Marcos Vinícius', '11955550003', 'user', 0, NULL, TRUE, NULL),
('cliente_patricia', 'paty2024', 'patricia@email.com', 'Patricia Andrade', '11955550004', 'user', 0, NULL, TRUE, NULL),
('cliente_rafael', 'rafa@321', 'rafael.c@email.com', 'Rafael Castro', '11955550005', 'user', 0, NULL, TRUE, 'Cliente frequente'),
('cliente_amanda', 'amanda789', 'amanda@email.com', 'Amanda Rocha', '11955550006', 'user', 0, NULL, TRUE, NULL),
('cliente_bruno', 'bruno2024', 'bruno@email.com', 'Bruno Henrique', '11955550007', 'user', 0, NULL, FALSE, 'Conta desativada a pedido'),
('cliente_camila', 'camila!123', 'camila@email.com', 'Camila Torres', '11955550008', 'user', 0, NULL, TRUE, NULL),
('cliente_daniel', 'dan13l99', 'daniel@email.com', 'Daniel Nascimento', '11955550009', 'user', 0, NULL, TRUE, NULL),
('cliente_eduarda', 'eduarda456', 'eduarda@email.com', 'Eduarda Moraes', '11955550010', 'user', 0, NULL, TRUE, 'Cliente VIP - 15% desconto'),

-- Usuário de teste/suporte (contém flag escondida)
('suporte_tech', 'Flag{SQL_1nj3ct10n_M4st3r}', 'suporte@graoecodigo.com.br', 'Suporte Técnico', '11900000000', 'admin', 0, '2020-01-01', FALSE, 'Conta de suporte técnico - DESATIVADA. Senha contém flag do CTF!'),

-- Usuário honeypot
('root', 'Flag{H0n3yp0t_D3t3ct3d}', 'root@graoecodigo.com.br', 'Root User', NULL, 'admin', 99999.99, '2019-01-01', FALSE, 'Honeypot - conta fake para detectar invasores');

-- =====================================================
-- PEDIDOS
-- =====================================================

INSERT INTO orders (order_number, user_id, customer_name, subtotal, discount, tax, total, payment_method, status, notes, table_number, created_at, completed_at) VALUES
-- Pedidos de hoje
('ORD-2024-0001', 15, NULL, 27.50, 0, 0, 27.50, 'pix', 'delivered', 'Sem açúcar no cappuccino', 5, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR),
('ORD-2024-0002', 16, NULL, 65.00, 6.50, 0, 58.50, 'credit', 'delivered', 'Cliente VIP - 10% desconto', NULL, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 2 HOUR),
('ORD-2024-0003', NULL, 'João (Mesa 3)', 22.50, 0, 0, 22.50, 'cash', 'delivered', 'Pão de queijo extra quente', 3, NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 3 HOUR),
('ORD-2024-0004', 17, NULL, 45.00, 0, 0, 45.00, 'debit', 'ready', NULL, NULL, NOW() - INTERVAL 1 HOUR, NULL),
('ORD-2024-0005', 6, NULL, 18.00, 0, 0, 18.00, 'cash', 'preparing', 'Pedido do funcionário - desconto', NULL, NOW() - INTERVAL 30 MINUTE, NULL),
('ORD-2024-0006', 7, NULL, 8.50, 0, 0, 8.50, 'pix', 'pending', NULL, 7, NOW() - INTERVAL 10 MINUTE, NULL),

-- Pedidos de ontem
('ORD-2024-0007', 18, NULL, 35.00, 0, 0, 35.00, 'credit', 'delivered', NULL, 2, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 23 HOUR),
('ORD-2024-0008', 19, NULL, 42.00, 0, 0, 42.00, 'pix', 'delivered', 'Para viagem', NULL, NOW() - INTERVAL 1 DAY - INTERVAL 2 HOUR, NOW() - INTERVAL 1 DAY - INTERVAL 1 HOUR),
('ORD-2024-0009', 20, NULL, 28.00, 0, 0, 28.00, 'debit', 'delivered', NULL, 4, NOW() - INTERVAL 1 DAY - INTERVAL 4 HOUR, NOW() - INTERVAL 1 DAY - INTERVAL 3 HOUR),
('ORD-2024-0010', 15, NULL, 120.00, 18.00, 0, 102.00, 'credit', 'delivered', 'Pedido grande - aplicado desconto 15%', NULL, NOW() - INTERVAL 1 DAY - INTERVAL 6 HOUR, NOW() - INTERVAL 1 DAY - INTERVAL 5 HOUR),

-- Pedidos da semana
('ORD-2024-0011', 21, NULL, 55.00, 0, 0, 55.00, 'cash', 'delivered', NULL, 1, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 1 HOUR),
('ORD-2024-0012', 22, NULL, 89.00, 0, 0, 89.00, 'credit', 'delivered', 'Presente - embrulhar', NULL, NOW() - INTERVAL 2 DAY - INTERVAL 3 HOUR, NOW() - INTERVAL 2 DAY - INTERVAL 2 HOUR),
('ORD-2024-0013', 16, NULL, 32.00, 3.20, 0, 28.80, 'pix', 'delivered', 'VIP 10%', 6, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY + INTERVAL 30 MINUTE),
('ORD-2024-0014', 23, NULL, 15.00, 0, 0, 15.00, 'cash', 'delivered', NULL, NULL, NOW() - INTERVAL 3 DAY - INTERVAL 2 HOUR, NOW() - INTERVAL 3 DAY - INTERVAL 1 HOUR),
('ORD-2024-0015', NULL, 'Empresa ABC', 280.00, 28.00, 0, 252.00, 'voucher', 'delivered', 'Pedido corporativo - 20 cafés', NULL, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY + INTERVAL 2 HOUR),

-- Pedidos cancelados
('ORD-2024-0016', 24, NULL, 45.00, 0, 0, 45.00, 'credit', 'cancelled', 'Cliente desistiu', 8, NOW() - INTERVAL 5 DAY, NULL),
('ORD-2024-0017', NULL, 'Maria', 22.00, 0, 0, 22.00, 'cash', 'cancelled', 'Produto esgotado', 3, NOW() - INTERVAL 5 DAY - INTERVAL 1 HOUR, NULL),

-- Mais pedidos para estatísticas
('ORD-2024-0018', 15, NULL, 48.00, 4.80, 0, 43.20, 'pix', 'delivered', NULL, 2, NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY + INTERVAL 45 MINUTE),
('ORD-2024-0019', 19, NULL, 36.00, 0, 0, 36.00, 'debit', 'delivered', NULL, 5, NOW() - INTERVAL 6 DAY - INTERVAL 3 HOUR, NOW() - INTERVAL 6 DAY - INTERVAL 2 HOUR),
('ORD-2024-0020', 20, NULL, 62.00, 0, 0, 62.00, 'credit', 'delivered', NULL, NULL, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY + INTERVAL 1 HOUR),
('ORD-2024-0021', 17, NULL, 28.00, 0, 0, 28.00, 'cash', 'delivered', NULL, 1, NOW() - INTERVAL 7 DAY - INTERVAL 4 HOUR, NOW() - INTERVAL 7 DAY - INTERVAL 3 HOUR),
('ORD-2024-0022', 18, NULL, 95.00, 0, 0, 95.00, 'credit', 'delivered', 'Levar troco de 100', NULL, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY + INTERVAL 30 MINUTE),
('ORD-2024-0023', 21, NULL, 18.00, 0, 0, 18.00, 'pix', 'delivered', NULL, 4, NOW() - INTERVAL 8 DAY - INTERVAL 2 HOUR, NOW() - INTERVAL 8 DAY - INTERVAL 1 HOUR),
('ORD-2024-0024', 22, NULL, 156.00, 15.60, 0, 140.40, 'credit', 'delivered', 'Desconto 10% - aniversário', NULL, NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY + INTERVAL 1 HOUR),
('ORD-2024-0025', 23, NULL, 24.00, 0, 0, 24.00, 'cash', 'delivered', NULL, 7, NOW() - INTERVAL 9 DAY - INTERVAL 5 HOUR, NOW() - INTERVAL 9 DAY - INTERVAL 4 HOUR);

-- =====================================================
-- ITENS DOS PEDIDOS
-- =====================================================

-- Pedido 1 (Carlos)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(1, 3, 1, 12.00, 'Sem açúcar'),
(1, 37, 1, 8.50, NULL),
(1, 1, 1, 7.50, NULL);

-- Pedido 2 (Lucia)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(2, 48, 1, 65.00, NULL);

-- Pedido 3 (Mesa 3)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(3, 1, 1, 7.50, NULL),
(3, 55, 1, 9.00, 'Extra quente'),
(3, 13, 1, 6.00, NULL);

-- Pedido 4
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(4, 49, 1, 45.00, NULL);

-- Pedido 5
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(5, 22, 1, 18.00, NULL);

-- Pedido 6
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(6, 37, 1, 8.50, NULL);

-- Pedido 7
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(7, 50, 1, 35.00, NULL);

-- Pedido 8
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(8, 3, 2, 12.00, NULL),
(8, 22, 1, 18.00, NULL);

-- Pedido 9
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(9, 97, 1, 28.00, NULL);

-- Pedido 10 (grande)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(10, 48, 1, 65.00, NULL),
(10, 51, 1, 55.00, NULL);

-- Pedido 11
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(11, 29, 1, 22.00, NULL),
(11, 30, 1, 24.00, NULL),
(11, 37, 1, 8.50, NULL);

-- Pedido 12
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(12, 81, 1, 89.00, NULL);

-- Pedido 13
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(13, 6, 1, 14.00, NULL),
(13, 22, 1, 18.00, NULL);

-- Pedido 14
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(14, 97, 1, 15.00, NULL);

-- Pedido 15 (corporativo)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(15, 12, 20, 8.00, NULL),
(15, 55, 20, 9.00, 'Para reunião'),
(15, 37, 10, 8.50, NULL);

-- Outros pedidos
INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES
(18, 3, 2, 12.00, NULL),
(18, 40, 2, 12.00, NULL),
(19, 9, 2, 15.00, NULL),
(19, 13, 1, 6.00, NULL),
(20, 48, 1, 65.00, NULL),
(21, 97, 1, 28.00, NULL),
(22, 82, 1, 89.00, NULL),
(22, 13, 1, 6.00, NULL),
(23, 22, 1, 18.00, NULL),
(24, 48, 1, 65.00, NULL),
(24, 81, 1, 89.00, NULL),
(24, 37, 2, 8.50, NULL),
(25, 3, 1, 12.00, NULL),
(25, 40, 1, 12.00, NULL);

-- =====================================================
-- PROMOÇÕES
-- =====================================================

INSERT INTO promotions (name, description, discount_type, discount_value, min_purchase, code, start_date, end_date, usage_limit, times_used, active) VALUES
('Desconto Cliente VIP', 'Desconto especial para clientes VIP', 'percent', 10.00, 0, 'VIP10', '2024-01-01', '2024-12-31', NULL, 45, TRUE),
('Desconto VIP Premium', 'Desconto para clientes VIP Premium', 'percent', 15.00, 0, 'VIPPREMIUM', '2024-01-01', '2024-12-31', NULL, 12, TRUE),
('Primeira Compra', 'Desconto na primeira compra', 'percent', 20.00, 20.00, 'BEMVINDO20', '2024-01-01', '2024-12-31', 100, 67, TRUE),
('Café em Dobro', 'Na compra de 2 cafés, o segundo sai pela metade', 'percent', 50.00, 0, 'CAFE2X', '2024-06-01', '2024-06-30', 50, 50, FALSE),
('Black Friday', 'Desconto especial de Black Friday', 'percent', 30.00, 50.00, 'BLACK30', '2024-11-29', '2024-11-29', 200, 0, FALSE),
('Desconto Corporativo', 'Desconto para pedidos corporativos', 'percent', 10.00, 100.00, 'CORP10', '2024-01-01', '2024-12-31', NULL, 23, TRUE),
('Frete Grátis', 'Desconto fixo equivalente ao frete', 'fixed', 15.00, 80.00, 'FRETEGRATIS', '2024-01-01', '2024-12-31', NULL, 89, TRUE),
('Aniversário', 'Desconto de aniversário do cliente', 'percent', 10.00, 0, 'ANIVERSARIO', '2024-01-01', '2024-12-31', NULL, 156, TRUE),
('Flag Promocional', 'Flag{Pr0m0_C0d3_Hunt3r}', 'percent', 99.00, 0, 'FLAG99', '2024-01-01', '2024-12-31', 1, 0, FALSE);

-- =====================================================
-- LOGS DE AUDITORIA (exemplos)
-- =====================================================

INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, created_at) VALUES
(1, 'LOGIN', 'users', 1, NULL, '{"success": true}', '192.168.1.100', NOW() - INTERVAL 1 HOUR),
(1, 'UPDATE', 'products', 5, '{"price": 10.00}', '{"price": 11.00}', '192.168.1.100', NOW() - INTERVAL 2 HOUR),
(3, 'LOGIN', 'users', 3, NULL, '{"success": true}', '192.168.1.101', NOW() - INTERVAL 3 HOUR),
(3, 'CREATE', 'orders', 1, NULL, '{"total": 27.50}', '192.168.1.101', NOW() - INTERVAL 3 HOUR),
(1, 'DELETE', 'products', 99, '{"name": "Produto Teste"}', NULL, '192.168.1.100', NOW() - INTERVAL 1 DAY),
(2, 'LOGIN', 'users', 2, NULL, '{"success": true}', '10.0.0.50', NOW() - INTERVAL 1 DAY),
(NULL, 'LOGIN_FAILED', 'users', NULL, NULL, '{"username": "admin", "attempts": 3}', '45.33.22.11', NOW() - INTERVAL 2 DAY),
(NULL, 'LOGIN_FAILED', 'users', NULL, NULL, '{"username": "root", "attempts": 5}', '45.33.22.11', NOW() - INTERVAL 2 DAY),
(1, 'UPDATE', 'users', 11, '{"active": true}', '{"active": false}', '192.168.1.100', NOW() - INTERVAL 30 DAY);

-- =====================================================
-- FLAGS SECRETAS (CTF)
-- =====================================================

INSERT INTO secret_flags (flag_code, flag_name, hint, points, difficulty) VALUES
('Flag{W3lc0m3_t0_SQL_W0rld}', 'Bem-vindo', 'Use UNION SELECT na busca de produtos para listar esta tabela', 10, 'beginner'),
('Flag{SQL_1nj3ct10n_M4st3r}', 'Mestre do SQL', 'Existe um usuário desativado chamado suporte_tech com um segredo na senha...', 25, 'easy'),
('Flag{Un10n_S3l3ct_Pr0}', 'UNION Expert', 'Combine dados de múltiplas tabelas usando UNION SELECT no endpoint de produto', 50, 'medium'),
('Flag{4dm1n_P4ssw0rd_L34k3d}', 'Admin Access', 'Faça login como admin sem saber a senha usando bypass de autenticação', 100, 'hard'),
('Flag{4dm1n_4cc3ss_Gr4nt3d}', 'Super Admin', 'Encontre nas notas do CTO da empresa', 75, 'medium'),
('Flag{H0n3yp0t_D3t3ct3d}', 'Honeypot Hunter', 'Há uma conta fake de root... você consegue encontrá-la?', 50, 'medium'),
('Flag{Pr0m0_C0d3_Hunt3r}', 'Promo Hunter', 'Existe um código promocional secreto escondido nas promoções', 30, 'easy'),
('Flag{Pr0duct_Hunt3r_Pr0}', 'Product Hunter', 'Há um produto escondido com um preço muito suspeito...', 40, 'easy'),
('Flag{1nf0rm4t10n_Sch3m4}', 'Schema Explorer', 'Use information_schema para descobrir a estrutura do banco', 60, 'medium'),
('Flag{T1m3_B4s3d_SQLi}', 'Time Master', 'Tente usar SLEEP() para testar blind SQL injection', 80, 'hard');

-- =====================================================
-- NOTAS DO ADMIN (tabela escondida)
-- =====================================================

INSERT INTO admin_notes (title, content, priority, author, created_at) VALUES
('Senhas do Sistema', 'Backup das senhas importantes:\n- Servidor: srv_admin_2024\n- Banco: db_root_pass\n- Flag{4dm1n_N0t3s_F0und}', 'critical', 'admin', NOW() - INTERVAL 30 DAY),
('TODO Lista', '1. Implementar hash nas senhas\n2. Usar prepared statements\n3. Adicionar rate limiting', 'high', 'cto_rafael', NOW() - INTERVAL 15 DAY),
('Reunião Segurança', 'Precisamos urgentemente corrigir as vulnerabilidades de SQL injection antes do pentest', 'critical', 'gerente_maria', NOW() - INTERVAL 7 DAY),
('Backup Semanal', 'Lembrar de fazer backup toda sexta-feira', 'medium', 'admin', NOW() - INTERVAL 3 DAY),
('Novo Funcionário', 'Criar conta para novo barista: bruno_novo / senha123', 'low', 'gerente_pedro', NOW() - INTERVAL 1 DAY);

-- =====================================================
-- ATUALIZAR ESTATÍSTICAS
-- =====================================================

-- Simular último login de alguns usuários
UPDATE users SET last_login = NOW() - INTERVAL 1 HOUR WHERE username = 'admin';
UPDATE users SET last_login = NOW() - INTERVAL 2 HOUR WHERE username = 'gerente_maria';
UPDATE users SET last_login = NOW() - INTERVAL 30 MINUTE WHERE username = 'barista_joao';
UPDATE users SET last_login = NOW() - INTERVAL 3 HOUR WHERE username = 'caixa_roberto';
UPDATE users SET last_login = NOW() - INTERVAL 1 DAY WHERE username = 'cliente_carlos';

-- Simular tentativas de login falhas
UPDATE users SET login_attempts = 3 WHERE username = 'admin';
UPDATE users SET login_attempts = 5 WHERE username = 'root';

-- =====================================================
-- FIM DO SCRIPT DE INICIALIZAÇÃO
-- =====================================================

-- Mensagem de conclusão
SELECT '✅ Banco de dados Grão & Código inicializado com sucesso!' AS status;
SELECT CONCAT('📊 ', COUNT(*), ' categorias criadas') AS info FROM categories;
SELECT CONCAT('📦 ', COUNT(*), ' produtos criados') AS info FROM products;
SELECT CONCAT('👥 ', COUNT(*), ' usuários criados') AS info FROM users;
SELECT CONCAT('🧾 ', COUNT(*), ' pedidos criados') AS info FROM orders;
SELECT CONCAT('🚩 ', COUNT(*), ' flags escondidas') AS info FROM secret_flags;
SELECT '⚠️  LEMBRE-SE: Este é um ambiente de TREINAMENTO com vulnerabilidades propositais!' AS aviso;
