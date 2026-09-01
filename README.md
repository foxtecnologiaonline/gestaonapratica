# Gestão na Prática

Blog de conteúdo + venda de produtos digitais + newsletter, para gestão de
pequenos negócios.

## Arquitetura (opção aprovada: "Composable Brasil-first")

- **Blog**: Next.js (App Router) + MDX. Posts são arquivos `.mdx` versionados
  no repositório em `content/posts/`, sem CMS externo. Renderização estática
  (SSG) para SEO e performance.
- **Produtos digitais**: hospedados e vendidos na **Hotmart** (checkout,
  pagamento via PIX/boleto/cartão, nota fiscal e antifraude ficam por conta
  da plataforma). O site só exibe a vitrine e linka para o checkout.
- **Newsletter**: formulário de captura próprio (`components/NewsletterForm.tsx`)
  que envia para uma rota interna (`app/api/newsletter/route.ts`). A
  integração com um provedor de e-mail (ESP) ainda não foi escolhida — está
  isolada em `lib/newsletter.ts`, um único ponto para plugar a API do
  provedor quando for definido.

- **Admin (`/admin`)**: painel protegido por senha para publicar posts sem
  editar arquivos direto, mais auditoria de SEO e status de Analytics. Ver
  seção própria abaixo.

## Estrutura de pastas

```
app/
  layout.tsx                 layout raiz (metadata, Google Analytics)
  sitemap.ts                  gera /sitemap.xml automaticamente
  robots.ts                   gera /robots.txt automaticamente
  (site)/layout.tsx            layout do site público (Header, Footer)
  (site)/page.tsx               home
  (site)/blog/page.tsx           listagem de posts
  (site)/blog/[slug]/page.tsx     página de um post
  (site)/produtos/page.tsx        vitrine de produtos digitais
  api/newsletter/route.ts        endpoint de inscrição na newsletter
  admin/login/                    tela de login do admin
  admin/(dashboard)/               painel protegido: visão geral, posts, seo, analytics
  api/admin/                       rotas de login/logout e CRUD de posts do admin
components/                 Header, Footer, PostCard, ProductCard,
                             NewsletterForm, RelatedProduct, GoogleAnalytics
components/admin/            PostForm, LogoutButton, DeletePostButton
content/posts/*.mdx         posts do blog (frontmatter + conteúdo)
lib/posts.ts                 leitura dos arquivos .mdx
lib/products.ts              catálogo de produtos digitais (dados + link Hotmart)
lib/newsletter.ts            lógica de inscrição (stub, pronto para plugar ESP)
lib/admin-session.ts          autenticação do admin (sessão assinada)
lib/github-content.ts         publica/exclui posts via GitHub Contents API
lib/posts-admin.ts            decide GitHub vs. gravação local ao publicar
lib/seo.ts                    auditoria de SEO por post e do site
lib/analytics.ts              status de conexão do Google Analytics
middleware.ts                 protege /admin e /api/admin por sessão
```

## Como adicionar um post novo

Crie um arquivo em `content/posts/meu-post.mdx`:

```mdx
---
title: "Título do post"
description: "Resumo de 1-2 linhas, usado no card e no SEO."
date: "2026-09-01"
tags: ["tag1", "tag2"]
relatedProduct: "slug-do-produto"   # opcional — veja lib/products.ts
---

Conteúdo em Markdown/MDX aqui.
```

O `relatedProduct` (opcional) faz o card do produto aparecer automaticamente
ao final do post — é assim que o conteúdo "vira" oferta.

## Como adicionar um produto digital novo

1. Crie o produto na Hotmart e copie o link de checkout.
2. Adicione um item em `lib/products.ts` com esse link em `hotmartUrl`.
3. Referencie o `slug` do produto no campo `relatedProduct` do(s) post(s)
   relacionados.

## Como plugar um provedor de newsletter (ESP)

Hoje o formulário só valida o e-mail e loga no servidor (nenhum e-mail é
enviado a lugar nenhum). Quando escolher um provedor (ConvertKit/Kit, Resend,
Beehiiv, etc.):

1. Abra `lib/newsletter.ts`.
2. Troque o corpo de `subscribeToNewsletter` pela chamada real à API do
   provedor (exemplo comentado já está no arquivo).
3. Adicione a chave de API como variável de ambiente (`.env.local`), nunca
   direto no código.

Nenhum outro arquivo do projeto precisa mudar.

## Painel administrativo (`/admin`)

Painel protegido por senha para publicar posts, acompanhar SEO e ver o status
do Analytics, sem precisar editar arquivos MDX manualmente.

### Configuração (variáveis de ambiente)

Copie `.env.example` para `.env.local` (desenvolvimento) ou configure as
mesmas variáveis no seu provedor de hospedagem (produção):

| Variável | Obrigatória | Para quê |
|---|---|---|
| `ADMIN_PASSWORD` | Sim, para logar | Senha única de acesso ao `/admin` |
| `ADMIN_SESSION_SECRET` | Sim, para logar | Chave para assinar a sessão (gere com `openssl rand -hex 32`) |
| `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` | Só em produção | Permite ao admin publicar posts via commit no repositório |
| `NEXT_PUBLIC_SITE_URL` | Recomendado | Base usada no `sitemap.xml` e `robots.txt` |
| `GOOGLE_SITE_VERIFICATION` | Opcional | Verificação de propriedade no Google Search Console |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Opcional | Ativa o Google Analytics (GA4) no site |

Sem `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` configurados, o login fica
desabilitado (retorna erro explicando o que falta).

### Como funciona a publicação de posts

O admin não tem banco de dados — posts continuam sendo arquivos `.mdx` no
repositório. Ao criar/editar/excluir um post pelo formulário:

- **Com `GITHUB_TOKEN`/`GITHUB_OWNER`/`GITHUB_REPO` configurados**: o admin
  faz um commit direto no repositório via GitHub Contents API. Se a
  hospedagem estiver com deploy automático (ex. Vercel conectado ao repo),
  esse commit dispara um novo build e o post aparece no site em 1-2 minutos.
  Recomenda-se um Personal Access Token com escopo restrito só a este
  repositório (permissão *Contents: Read and write*).
- **Sem essas variáveis**: em `npm run dev`, o admin grava o arquivo
  diretamente em `content/posts/` (útil para testar). Em produção, essa
  gravação é bloqueada com um erro claro, porque o filesystem de hospedagens
  serverless não é persistente — sem GitHub configurado, não há como um post
  criado no admin sobreviver a um redeploy.

Exclusão de post é só mais um commit — dá para recuperar pelo histórico do
Git se for engano.

### SEO

- `app/sitemap.ts` e `app/robots.ts` geram `/sitemap.xml` e `/robots.txt`
  automaticamente a partir dos posts publicados (`/admin` fica bloqueado
  para indexação).
- A aba **SEO** do admin audita cada post (tamanho de título/meta descrição,
  tags, tamanho do conteúdo, produto relacionado) e mostra um checklist do
  site inteiro.

### Analytics

Sem credenciais do Google configuradas, o admin não inventa números. A aba
**Analytics** mostra se o GA4 está conectado (via
`NEXT_PUBLIC_GA_MEASUREMENT_ID`) e como conectar o Search Console. Números de
tráfego reais ficam no painel do próprio Google Analytics; trazê-los para
dentro do admin exigiria integrar a API do Google com credenciais OAuth
próprias seu — dá pra fazer depois, se fizer sentido.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha ADMIN_PASSWORD e ADMIN_SESSION_SECRET para testar o /admin
npm run dev
```

## Próximos passos sugeridos

- Definir e plugar o provedor de newsletter real.
- Publicar os produtos na Hotmart e atualizar os links em `lib/products.ts`.
- Adicionar imagens de capa aos posts (`coverImage` no frontmatter).
- Configurar domínio e deploy (Vercel é o caminho mais direto para Next.js).
- Configurar `GITHUB_TOKEN`/`GITHUB_OWNER`/`GITHUB_REPO` em produção para o
  admin conseguir publicar posts de verdade.
