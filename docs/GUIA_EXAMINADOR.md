# 👨‍🏫 Guia do Examinador

> Instruções completas para aplicação e avaliação da prova prática

---

## 📋 Índice

1. [Visão Geral da Prova](#-visão-geral-da-prova)
2. [Preparação do Ambiente](#-preparação-do-ambiente)
3. [Antes da Prova](#-antes-da-prova)
4. [Durante a Prova](#-durante-a-prova)
5. [Avaliação e Pontuação](#-avaliação-e-pontuação)
6. [Critérios de Desempenho](#-critérios-de-desempenho)
7. [Troubleshooting](#-troubleshooting)
8. [Checklist do Examinador](#-checklist-do-examinador)

---

## 📖 Visão Geral da Prova

### Objetivo
Avaliar competências técnicas de desenvolvedores Junior em:
- Consumo e teste de APIs REST
- Compreensão de segurança (SQL Injection)
- Debugging e correção de código
- Raciocínio lógico e resolução de problemas

### Estrutura

| Parte | Nome | Duração | Pontuação | Foco |
|-------|------|---------|-----------|------|
| 1 | Exploração com Postman | 30-45 min | 30 pts | APIs REST |
| 2 | CTF - SQL Injection | 60-90 min | 520 pts | Segurança |
| 3 | Correção de Bugs | 45-60 min | 60 pts | Debugging |
| **Total** | | **2.5-3.5h** | **610 pts** | |

### Competências Avaliadas

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPETÊNCIAS TÉCNICAS                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Parte 1       │    Parte 2      │       Parte 3           │
│   (Postman)     │    (CTF)        │       (Bugs)            │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • HTTP Methods  │ • SQL básico    │ • Leitura de código     │
│ • JSON          │ • Segurança     │ • JavaScript            │
│ • Query params  │ • Pensamento    │ • Debugging             │
│ • Status codes  │   analítico     │ • Tipos de dados        │
│ • REST patterns │ • Pesquisa      │ • Async/await           │
└─────────────────┴─────────────────┴─────────────────────────┘
```

---

## 🔧 Preparação do Ambiente

### Requisitos do Sistema

**Na máquina do candidato:**
- [ ] Docker Desktop instalado e funcionando
- [ ] Docker Compose disponível
- [ ] Postman instalado (ou Insomnia/Thunder Client)
- [ ] VS Code (ou editor de preferência)
- [ ] Terminal/Command Prompt
- [ ] Navegador web (apenas para localhost)
- [ ] **Internet DESABILITADA** (ou monitorada)
- [ ] Documento GUIA_CANDIDATO.md acessível (impresso ou digital)

### Passo a Passo de Instalação

#### 1. Verificar Docker
```bash
docker --version
# Deve mostrar: Docker version 20.x ou superior

docker-compose --version
# Deve mostrar: Docker Compose version 2.x ou superior
```

#### 2. Preparar o Projeto
```bash
# Clonar/copiar o projeto para a máquina
cd /caminho/para/prova-jr

# Verificar estrutura
ls -la
# Deve mostrar: docker-compose.yml, Dockerfile, src/, docs/, etc.
```

#### 3. Iniciar os Containers (TESTE ANTES!)
```bash
# Build e start
docker-compose up --build

# Aguardar mensagem de sucesso:
# ═══════════════════════════════════════════════════
#    ☕ GRÃO & CÓDIGO - API da Cafeteria
# ═══════════════════════════════════════════════════
#    🚀 Servidor rodando em: http://localhost:3000
```

#### 4. Testar Endpoints
```bash
# Em outro terminal
curl http://localhost:3000
curl http://localhost:3000/api/products
curl http://localhost:3000/api/vulnerable/flags
```

#### 5. Parar os Containers
```bash
# Ctrl+C no terminal do docker-compose
# ou
docker-compose down
```

---

## 📝 Antes da Prova

### Checklist de Preparação (1 dia antes)

- [ ] Testar ambiente completo em todas as máquinas
- [ ] Verificar se Postman está instalado
- [ ] Preparar cópias do `GUIA_CANDIDATO.md`
- [ ] Preparar planilha de avaliação
- [ ] Definir política de pesquisa na internet
- [ ] Preparar sala/ambiente silencioso
- [ ] Ter backup do projeto em pendrive

### Checklist de Preparação (30 min antes)

- [ ] Iniciar Docker em todas as máquinas
- [ ] Executar `docker-compose up --build`
- [ ] Verificar se API está respondendo
- [ ] Abrir Postman em todas as máquinas
- [ ] Distribuir documento do candidato
- [ ] Resetar banco se necessário:
  ```bash
  docker-compose down -v
  docker-compose up --build
  ```

### Configuração Recomendada de Sala

```
┌─────────────────────────────────────────────────────┐
│                    SALA DE PROVA                     │
│                                                      │
│   [Candidato 1]    [Candidato 2]    [Candidato 3]   │
│       💻               💻               💻          │
│                                                      │
│   [Candidato 4]    [Candidato 5]    [Candidato 6]   │
│       💻               💻               💻          │
│                                                      │
│                  ┌─────────────┐                     │
│                  │ EXAMINADOR  │                     │
│                  │     💻      │                     │
│                  └─────────────┘                     │
└─────────────────────────────────────────────────────┘
```

---

## ⏱️ Durante a Prova

### Cronograma Sugerido

| Horário | Duração | Atividade |
|---------|---------|-----------|
| 00:00 | 10 min | Apresentação e instruções |
| 00:10 | 35 min | **Parte 1**: Exploração com Postman |
| 00:45 | 10 min | Pausa / Dúvidas |
| 00:55 | 75 min | **Parte 2**: CTF - SQL Injection |
| 02:10 | 10 min | Pausa |
| 02:20 | 50 min | **Parte 3**: Correção de Bugs |
| 03:10 | 10 min | Encerramento e coleta |

### Script de Apresentação

```
"Bem-vindos à prova prática de desenvolvimento!

Hoje vocês vão trabalhar com uma API de uma cafeteria chamada 
'Grão & Código'. A prova tem 3 partes:

1. EXPLORAÇÃO (30 min): Testar a API usando Postman
2. CTF (75 min): Encontrar vulnerabilidades de segurança
3. BUGS (50 min): Corrigir erros no código

Vocês podem:
✅ Consultar o documento GUIA_CANDIDATO.md (contém toda referência técnica)
✅ Usar Postman e VS Code
✅ Fazer anotações

Vocês NÃO podem:
❌ Pesquisar na internet
❌ Comunicar-se com outros candidatos
❌ Usar IA generativa (ChatGPT, etc.)
❌ Acessar celular ou materiais pessoais

IMPORTANTE: O Guia do Candidato contém toda a referência técnica
necessária - SQL Injection, JavaScript, HTTP, etc. Leiam com atenção!

A API já está rodando em http://localhost:3000
O documento está em docs/GUIA_CANDIDATO.md

Alguma dúvida? ... Podem começar!"
```

### Monitoramento

**O que observar:**

1. **Metodologia de trabalho**
   - Candidato lê a documentação?
   - Testa sistematicamente ou aleatoriamente?
   - Documenta suas descobertas?

2. **Resolução de problemas**
   - Como reage a erros?
   - Pesquisa soluções ou desiste?
   - Pede ajuda adequadamente?

3. **Comportamento**
   - Mantém foco?
   - Administra bem o tempo?
   - Demonstra frustração excessiva?

**Logs em tempo real:**
```bash
# Monitorar atividade dos candidatos
docker-compose logs -f api | grep VULNERABLE
```

### Intervenções Permitidas

| Situação | Ação |
|----------|------|
| Problema técnico (Docker caiu) | Ajudar a resolver |
| Dúvida sobre enunciado | Esclarecer sem dar dicas |
| Candidato travado há 15+ min | Oferecer dica genérica |
| Comportamento irregular | Advertir e anotar |

### Dicas Autorizadas (se necessário)

**Para Parte 1:**
- "Verifique os métodos HTTP na seção de referência do guia"
- "Leia a documentação em /api/docs"

**Para Parte 2:**
- "Acesse /api/vulnerable/flags para ver dicas"
- "Consulte a seção de SQL Injection no guia do candidato"
- "Tente colocar uma aspas simples no campo"

**Para Parte 3:**
- "Leia os comentários no código, procure /* BUG #X */"
- "Consulte a seção de JavaScript no guia do candidato"
- "Compare o resultado esperado com o obtido"

---

## 📊 Avaliação e Pontuação

### Parte 1: Exploração com Postman (30 pontos)

| Critério | Pontos | Como Verificar |
|----------|--------|----------------|
| Fez requisições GET com sucesso | 5 | Collection do Postman |
| Fez requisições POST com sucesso | 5 | Collection do Postman |
| Usou query params corretamente | 5 | Collection do Postman |
| Interpretou erros HTTP (4xx, 5xx) | 5 | Perguntar ou observar |
| Conseguiu criar um pedido completo | 5 | Verificar no banco |
| Documentou/organizou os testes | 5 | Collection do Postman |

**Verificação rápida:**
```bash
# Ver pedidos criados durante a prova
docker exec grao-codigo-mysql mysql -ucafeteria -pcafeteria123 grao_codigo -e "SELECT * FROM orders ORDER BY id DESC LIMIT 5;"
```

### Parte 2: CTF - SQL Injection (520 pontos)

| Flag | Código | Pontos | Dificuldade |
|------|--------|--------|-------------|
| 1 | `Flag{W3lc0m3_t0_SQL_W0rld}` | 10 | 🟢 Iniciante |
| 2 | `Flag{SQL_1nj3ct10n_M4st3r}` | 25 | 🟢 Fácil |
| 3 | `Flag{Pr0m0_C0d3_Hunt3r}` | 30 | 🟢 Fácil |
| 4 | `Flag{Pr0duct_Hunt3r_Pr0}` | 40 | 🟡 Fácil |
| 5 | `Flag{Un10n_S3l3ct_Pr0}` | 50 | 🟡 Médio |
| 6 | `Flag{H0n3yp0t_D3t3ct3d}` | 50 | 🟡 Médio |
| 7 | `Flag{1nf0rm4t10n_Sch3m4}` | 60 | 🟡 Médio |
| 8 | `Flag{4dm1n_4cc3ss_Gr4nt3d}` | 75 | 🟠 Médio |
| 9 | `Flag{4dm1n_N0t3s_F0und}` | 80 | 🟠 Médio-Difícil |
| 10 | `Flag{4dm1n_P4ssw0rd_L34k3d}` | 100 | 🔴 Difícil |

**Como coletar:**
- Pedir ao candidato para listar as flags encontradas
- Verificar histórico do Postman
- Conferir logs do container

### Parte 3: Correção de Bugs (60 pontos)

| Bug | Descrição | Pontos | Arquivo/Linha |
|-----|-----------|--------|---------------|
| #1 | Comparação de tipos | 10 | buggy.js ~35 |
| #2 | Cálculo string vs number | 10 | buggy.js ~65 |
| #3 | forEach async | 10 | buggy.js ~95 |
| #4 | Off-by-one no loop | 10 | buggy.js ~140 |
| #5 | Validação de entrada | 10 | buggy.js ~175 |
| #6 | Escopo var vs let | 10 | buggy.js ~210 |

**Como verificar:**
```bash
# Abrir o arquivo modificado
cat src/routes/buggy.js

# Ou usar diff se tiver backup
diff src/routes/buggy.js backup/buggy.js
```

**Critérios de correção:**

| Nível | Descrição | Pontos |
|-------|-----------|--------|
| Completo | Bug corrigido corretamente | 10/10 |
| Parcial | Identificou mas não corrigiu bem | 5/10 |
| Incorreto | Solução não funciona | 0/10 |

---

## 📈 Critérios de Desempenho

### Classificação por Pontuação

| Nível | Pontuação | % do Total | Perfil |
|-------|-----------|------------|--------|
| **Expert** | 500+ | 82%+ | Pronto para projetos complexos |
| **Avançado** | 350-499 | 57-81% | Pronto para desenvolvimento |
| **Intermediário** | 200-349 | 33-56% | Precisa de mentoria |
| **Iniciante** | 100-199 | 16-32% | Precisa de treinamento básico |
| **Insuficiente** | <100 | <16% | Não recomendado |

### Matriz de Competências

```
                    BAIXO          MÉDIO          ALTO
                 (0-33%)        (34-66%)       (67-100%)
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ APIs REST    │ Não consegue │ Faz GET/POST │ CRUD completo│
│ (Parte 1)    │ fazer GET    │ básicos      │ + filtros    │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ SQL/Segur.   │ Não entende  │ SQLi básico  │ UNION, bypass│
│ (Parte 2)    │ SQL Injection│ (1-3 flags)  │ (5+ flags)   │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ JavaScript   │ Não corrigiu │ Corrigiu     │ Corrigiu     │
│ (Parte 3)    │ nenhum bug   │ 1-3 bugs     │ 4+ bugs      │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Análise por Área

**Se foi bem na Parte 1, mas mal na 2 e 3:**
- Sabe usar ferramentas, mas falta conhecimento técnico
- Recomendação: Treinamento em lógica e programação

**Se foi bem na Parte 2, mas mal na 1 e 3:**
- Perfil analítico/hacker, mas falta prática de desenvolvimento
- Recomendação: Projetos práticos de código

**Se foi bem na Parte 3, mas mal na 1 e 2:**
- Conhece programação, mas falta experiência com APIs
- Recomendação: Projetos com integrações

**Equilibrado em todas:**
- Candidato completo
- Recomendação: Projetos gradualmente mais complexos

### Indicadores Qualitativos

Além da pontuação, observe e anote:

| Indicador | Negativo | Positivo |
|-----------|----------|----------|
| **Autonomia** | Pergunta tudo | Resolve sozinho |
| **Metodologia** | Tenta aleatoriamente | Testa sistematicamente |
| **Resiliência** | Desiste fácil | Persiste nos problemas |
| **Organização** | Requests bagunçados | Collection organizada |
| **Uso da Referência** | Não consulta o guia | Usa a referência técnica |
| **Leitura** | Não lê a documentação | Lê atentamente antes de agir |

---

## 🆘 Troubleshooting

### Problema: Docker não inicia

```bash
# Verificar se Docker está rodando
docker info

# Se não estiver, iniciar Docker Desktop manualmente

# Limpar e reiniciar
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### Problema: API não responde

```bash
# Verificar status dos containers
docker-compose ps

# Ver logs
docker-compose logs api
docker-compose logs mysql

# Reiniciar apenas a API
docker-compose restart api
```

### Problema: Banco não conecta

```bash
# MySQL pode demorar até 60s para iniciar
# Verificar logs do MySQL
docker-compose logs mysql

# Se necessário, reiniciar tudo
docker-compose down
docker-compose up --build
```

### Problema: Porta 3000 em uso

```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou mudar a porta no docker-compose.yml
ports:
  - "3001:3000"  # Usar 3001 ao invés de 3000
```

### Problema: Candidato corrompeu o banco

```bash
# Reset completo do banco
docker-compose down -v
docker-compose up --build

# O banco será recriado com dados iniciais
```

### Problema: Código do candidato quebrou a API

```bash
# Restaurar arquivo original
git checkout src/routes/buggy.js

# Ou copiar do backup
cp backup/buggy.js src/routes/buggy.js

# Hot reload deve pegar automaticamente
```

---

## ✅ Checklist do Examinador

### Antes da Prova
- [ ] Docker funcionando em todas as máquinas
- [ ] API respondendo em http://localhost:3000
- [ ] Postman instalado e funcionando
- [ ] Documento do candidato impresso/disponível
- [ ] Planilha de avaliação preparada
- [ ] Cronômetro/relógio visível

### Durante a Prova
- [ ] Cronometrar cada parte
- [ ] Anotar observações comportamentais
- [ ] Monitorar logs (opcional)
- [ ] Responder dúvidas sobre enunciado
- [ ] Não dar dicas técnicas (exceto se autorizado)

### Após a Prova
- [ ] Coletar flags encontradas (Parte 2)
- [ ] Verificar correções de bugs (Parte 3)
- [ ] Revisar Collection do Postman (Parte 1)
- [ ] Preencher planilha de avaliação
- [ ] Resetar ambiente para próximo candidato
- [ ] Backup das evidências (se necessário)

---

## 📄 Modelo de Planilha de Avaliação

```
╔══════════════════════════════════════════════════════════════════╗
║              AVALIAÇÃO - PROVA PRÁTICA DEV JUNIOR                ║
╠══════════════════════════════════════════════════════════════════╣
║ Candidato: _______________________  Data: ___/___/______         ║
║ Examinador: ______________________  Hora: ___:___ - ___:___      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║ PARTE 1 - EXPLORAÇÃO COM POSTMAN (máx. 30 pts)                   ║
║ ┌────────────────────────────────────────────────────┬─────────┐ ║
║ │ Requisições GET bem-sucedidas                      │ __/5    │ ║
║ │ Requisições POST bem-sucedidas                     │ __/5    │ ║
║ │ Uso correto de query params                        │ __/5    │ ║
║ │ Interpretação de erros HTTP                        │ __/5    │ ║
║ │ Criou pedido completo                              │ __/5    │ ║
║ │ Organização da collection                          │ __/5    │ ║
║ ├────────────────────────────────────────────────────┼─────────┤ ║
║ │ SUBTOTAL PARTE 1                                   │ __/30   │ ║
║ └────────────────────────────────────────────────────┴─────────┘ ║
║                                                                   ║
║ PARTE 2 - CTF SQL INJECTION (máx. 520 pts)                       ║
║ ┌────────────────────────────────────────────────────┬─────────┐ ║
║ │ [ ] Flag 1 - Welcome (UNION básico)                │ __/10   │ ║
║ │ [ ] Flag 2 - SQL Master (user inativo)             │ __/25   │ ║
║ │ [ ] Flag 3 - Promo Hunter (promoções)              │ __/30   │ ║
║ │ [ ] Flag 4 - Product Hunter (produto escondido)    │ __/40   │ ║
║ │ [ ] Flag 5 - Union Pro (UNION avançado)            │ __/50   │ ║
║ │ [ ] Flag 6 - Honeypot (root fake)                  │ __/50   │ ║
║ │ [ ] Flag 7 - Schema (information_schema)           │ __/60   │ ║
║ │ [ ] Flag 8 - CTO Notes (notas do CTO)              │ __/75   │ ║
║ │ [ ] Flag 9 - Admin Notes (tabela escondida)        │ __/80   │ ║
║ │ [ ] Flag 10 - Admin Access (bypass login)          │ __/100  │ ║
║ ├────────────────────────────────────────────────────┼─────────┤ ║
║ │ SUBTOTAL PARTE 2                                   │ __/520  │ ║
║ └────────────────────────────────────────────────────┴─────────┘ ║
║                                                                   ║
║ PARTE 3 - CORREÇÃO DE BUGS (máx. 60 pts)                         ║
║ ┌────────────────────────────────────────────────────┬─────────┐ ║
║ │ [ ] Bug 1 - Comparação de tipos                    │ __/10   │ ║
║ │ [ ] Bug 2 - String + number                        │ __/10   │ ║
║ │ [ ] Bug 3 - forEach async                          │ __/10   │ ║
║ │ [ ] Bug 4 - Off-by-one error                       │ __/10   │ ║
║ │ [ ] Bug 5 - Validação de entrada                   │ __/10   │ ║
║ │ [ ] Bug 6 - Escopo var vs let                      │ __/10   │ ║
║ ├────────────────────────────────────────────────────┼─────────┤ ║
║ │ SUBTOTAL PARTE 3                                   │ __/60   │ ║
║ └────────────────────────────────────────────────────┴─────────┘ ║
║                                                                   ║
║ ═══════════════════════════════════════════════════════════════  ║
║ PONTUAÇÃO TOTAL                                      │ __/610  │ ║
║ ═══════════════════════════════════════════════════════════════  ║
║                                                                   ║
║ CLASSIFICAÇÃO:                                                    ║
║ [ ] Expert (500+)     [ ] Avançado (350-499)                     ║
║ [ ] Intermediário (200-349)  [ ] Iniciante (100-199)             ║
║ [ ] Insuficiente (<100)                                          ║
║                                                                   ║
║ OBSERVAÇÕES COMPORTAMENTAIS:                                      ║
║ Autonomia:      [ ] Baixa    [ ] Média    [ ] Alta               ║
║ Metodologia:    [ ] Baixa    [ ] Média    [ ] Alta               ║
║ Resiliência:    [ ] Baixa    [ ] Média    [ ] Alta               ║
║ Organização:    [ ] Baixa    [ ] Média    [ ] Alta               ║
║                                                                   ║
║ COMENTÁRIOS:                                                      ║
║ _______________________________________________________________  ║
║ _______________________________________________________________  ║
║ _______________________________________________________________  ║
║                                                                   ║
║ RECOMENDAÇÃO:                                                     ║
║ [ ] Aprovado - Pronto para projetos                              ║
║ [ ] Aprovado com ressalvas - Precisa mentoria em: ____________   ║
║ [ ] Em desenvolvimento - Precisa treinamento em: _____________   ║
║ [ ] Não aprovado                                                 ║
║                                                                   ║
║ Assinatura do Examinador: _____________________                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📞 Suporte

Em caso de problemas técnicos graves durante a prova:
- Pausar o cronômetro
- Resolver o problema
- Adicionar tempo proporcional ao candidato

**Contatos de emergência:**
- Equipe de Infraestrutura: [inserir contato]
- Líder Técnico: [inserir contato]

---

*Documento confidencial - Uso exclusivo dos examinadores*
