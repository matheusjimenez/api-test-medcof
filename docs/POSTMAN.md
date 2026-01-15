# 📮 Guia do Postman

> Como usar o Postman para testar a API Grão & Código

---

## 🚀 Configuração Inicial

### 1. Instalar o Postman

Baixe em: https://www.postman.com/downloads/

### 2. Criar uma Collection

1. Clique em **Collections** no menu lateral
2. Clique em **+ New Collection**
3. Nome: `Grão & Código API`
4. Salve

### 3. Criar uma Environment (Opcional)

1. Clique no ícone de engrenagem (⚙️)
2. **Add** > Nome: `Local`
3. Adicione variável:
   - Variable: `base_url`
   - Initial Value: `http://localhost:3000`
4. Salve e selecione o environment

---

## 📝 Criando Requisições

### Requisição GET

1. Clique em **+** para nova requisição
2. Selecione **GET**
3. URL: `http://localhost:3000/api/products`
4. Clique em **Send**

### Requisição GET com Query Params

1. URL: `http://localhost:3000/api/products`
2. Aba **Params**:
   - Key: `category` | Value: `1`
   - Key: `active` | Value: `true`
3. Clique em **Send**

### Requisição POST

1. Selecione **POST**
2. URL: `http://localhost:3000/api/auth/login`
3. Aba **Body**:
   - Selecione **raw**
   - Formato: **JSON**
   - Conteúdo:
   ```json
   {
       "username": "barista_joao",
       "password": "cafezinho"
   }
   ```
4. Clique em **Send**

---

## 🔍 Exemplos de Requisições

### Produtos

#### Listar Todos os Produtos
```
GET http://localhost:3000/api/products
```

#### Filtrar por Categoria
```
GET http://localhost:3000/api/products?category=1
```

#### Filtrar por Preço
```
GET http://localhost:3000/api/products?minPrice=10&maxPrice=30
```

#### Buscar Produto por ID
```
GET http://localhost:3000/api/products/1
```

#### Criar Produto
```
POST http://localhost:3000/api/products
Content-Type: application/json

{
    "name": "Café Gelado Premium",
    "description": "Café gelado com leite",
    "price": 15.00,
    "stock": 50,
    "category_id": 2
}
```

#### Atualizar Produto
```
PUT http://localhost:3000/api/products/1
Content-Type: application/json

{
    "price": 8.50,
    "stock": 200
}
```

---

### Categorias

#### Listar Categorias
```
GET http://localhost:3000/api/categories
```

#### Categoria com Produtos
```
GET http://localhost:3000/api/categories/1
```

---

### Usuários

#### Listar Usuários
```
GET http://localhost:3000/api/users
```

#### Filtrar por Cargo
```
GET http://localhost:3000/api/users?role=barista
```

---

### Pedidos

#### Listar Pedidos
```
GET http://localhost:3000/api/orders
```

#### Detalhes do Pedido
```
GET http://localhost:3000/api/orders/1
```

#### Criar Pedido
```
POST http://localhost:3000/api/orders
Content-Type: application/json

{
    "user_id": 5,
    "items": [
        { "product_id": 1, "quantity": 2 },
        { "product_id": 2, "quantity": 1 },
        { "product_id": 13, "quantity": 3 }
    ],
    "notes": "Sem açúcar no café"
}
```

#### Atualizar Status
```
PATCH http://localhost:3000/api/orders/1/status
Content-Type: application/json

{
    "status": "preparing"
}
```

---

### Autenticação

#### Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123"
}
```

#### Registrar
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "username": "novo_usuario",
    "password": "senha123",
    "email": "novo@email.com"
}
```

---

## 🚩 Testando SQL Injection

### Busca Vulnerável

```
GET http://localhost:3000/api/vulnerable/search?q=café
```

Tente estes payloads no parâmetro `q`:

```
# Teste básico
café' OR '1'='1

# Ver estrutura
'

# UNION básico
' UNION SELECT 1,2,3,4,5,6,7,8,9 --
```

### Login Vulnerável

```
POST http://localhost:3000/api/vulnerable/login
Content-Type: application/json

{
    "username": "admin' --",
    "password": "qualquer"
}
```

### Produto Vulnerável

```
GET http://localhost:3000/api/vulnerable/product/1

# Com injection
GET http://localhost:3000/api/vulnerable/product/1 OR 1=1
```

---

## 🐛 Testando Bugs

### Bug #1 - Comparação
```
GET http://localhost:3000/api/buggy/products
# Observe produtos com stock=0
```

### Bug #2 - Cálculo
```
GET http://localhost:3000/api/buggy/total/1
# Observe o calculated_total
```

### Bug #3 - Async
```
POST http://localhost:3000/api/buggy/order
Content-Type: application/json

{
    "user_id": 5,
    "items": [
        { "product_id": 1, "quantity": 2 }
    ]
}
# Depois faça GET /api/orders/<id> para verificar
```

### Bug #4 - Ranking
```
GET http://localhost:3000/api/buggy/ranking
# Observe o último item do ranking
```

### Bug #5 - Validação
```
POST http://localhost:3000/api/buggy/discount
Content-Type: application/json

{
    "product_id": 1,
    "discount_percent": -50
}
```

### Bug #6 - Escopo
```
GET http://localhost:3000/api/buggy/summary
# Observe os totais acumulando
```

---

## 💡 Dicas do Postman

### Atalhos Úteis

| Ação | Atalho |
|------|--------|
| Nova requisição | Ctrl + N |
| Enviar requisição | Ctrl + Enter |
| Salvar | Ctrl + S |
| Duplicar | Ctrl + D |

### Console

- Pressione **Ctrl + Alt + C** para abrir o console
- Veja detalhes das requisições e respostas
- Útil para debug

### Variáveis

Use variáveis para não repetir valores:

```
{{base_url}}/api/products
```

Configure em **Environment Variables**.

### Testes Automatizados

Na aba **Tests**, você pode adicionar validações:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has products", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.data).to.be.an('array');
});
```

---

## 📥 Importar Collection

Se houver um arquivo de collection disponível:

1. Clique em **Import**
2. Arraste o arquivo `.json`
3. Confirme a importação

---

## ❓ Problemas Comuns

### "Could not get response"
- Verifique se a API está rodando
- Confirme a URL: `http://localhost:3000`

### "Connection refused"
- Docker não está rodando
- Execute: `docker-compose up`

### "404 Not Found"
- Verifique a rota
- Confira se há `/api/` no caminho

### JSON inválido
- Verifique vírgulas e aspas
- Use aspas duplas, não simples
- Não deixe vírgula no último item

---

*Guia criado para a prova prática de desenvolvedores Junior*
