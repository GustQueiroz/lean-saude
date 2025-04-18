# Lean Saúde – Desafio Técnico

## O projeto está dividido em duas pastas principais:

```
lean-saude/
├─ leanSaude_api/     # Backend em Node.js + NestJS
└─ leanSaude_app/     # Frontend em React.js + Next.js
```

---

## Como rodar

### O que você vai precisar

Node.js (versão 18 ou mais recente)
Yarn ou NPM

---

### Clone o repositório:

```bash
git clone https://github.com/GustQueiroz/lean-saude.git
cd leanProject
```

---

### Backend

#### 1. Instale as dependências:

```bash
cd leanSaude_api
npm install
```

#### 2. Na pasta leanSaude_api crie um arquivo .env com:

```env
DATABASE_URL="postgresql://leansaude_owner:npg_xmCd5qRT0eWk@ep-cold-base-acr1ztcg-pooler.sa-east-1.aws.neon.tech/leansaude?sslmode=require"
JWT_SECRET="mkoijnhbunjimkoinjbuhvgyuhbnjimkoijbhuvbgycfttfcvgyhuhbnijokmlpoi987fvtrdwsxdfvghnijuhgetrsscgbrdfdzxwazwsexcrtfg"
JWT_EXPIRES_IN=1d
PORT=3333
```

#### 3. Gere as dependencias do Prisma:

```bash
npx prisma generate
```

#### 4. Inicie a API:

```bash
npm run start:dev
```

A API estará rodando em:
`http://localhost:3333`

---

### Frontend

#### 1. Instale as dependências:

```bash
cd leanSaude_app
npm install
```

#### 2. Na pasta leanSaude_app crie um arquivo .env com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

#### 3. Rode a aplicação em interface de desenvolvimento:

```bash
npm run dev
```

#### Ou se preferir, rode a aplicação ja compilada:

```bash
npm run build
```

```bash
npm start
```

Acesse em:
`http://localhost:3000`

#### 4. Faça logIn:

email: camila@lean.com
senha: 123456

---

## Arquitetura e Decisões Técnicas

### Backend (Nest.js + Prisma)

**Autenticação com JWT e bcrypt**
**Simulação de mensageria (pronto para integrar com AWS SQS)**
**Sistema de filtros avançados para busca de dados**
**Estrutura modular dividida por funcionalidades**

### Frontend (Next.js + Tailwind + Radix-ui)

**Componentes reutilizáveis**
**Interface limpa e intuitiva**
**Listagem com filtros dinâmicos e paginação**

---

### Melhorias futuras

Se tivesse mais tempo, gostaria de adicionar:

### No backend:

**Validação de entrada com class-validator**
**Proteção de rotas com Guards**
**Testes unitários e e2e**
**Integração real com AWS SQS**
**Documentação com Swagger**

### No frontend:

**Aprimorar verificações de segurança**
**Melhorar feedback visual usuário**
**Aprimorar fluxo de autenticação**
**Otimizar a experiência mobile**

---

Desenvolvido por Gustavo Queiroz, como teste técnico para a Lean Saúde.
