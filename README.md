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

## Estrutura de pastas

```
app/
  layout.tsx              layout raiz (Header, Footer, metadata)
  page.tsx                home
  blog/page.tsx            listagem de posts
  blog/[slug]/page.tsx      página de um post
  produtos/page.tsx         vitrine de produtos digitais
  api/newsletter/route.ts   endpoint de inscrição na newsletter
components/                Header, Footer, PostCard, ProductCard,
                            NewsletterForm, RelatedProduct
content/posts/*.mdx        posts do blog (frontmatter + conteúdo)
lib/posts.ts                leitura dos arquivos .mdx
lib/products.ts             catálogo de produtos digitais (dados + link Hotmart)
lib/newsletter.ts           lógica de inscrição (stub, pronto para plugar ESP)
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

## Rodando localmente

```bash
npm install
npm run dev
```

## Próximos passos sugeridos

- Definir e plugar o provedor de newsletter real.
- Publicar os produtos na Hotmart e atualizar os links em `lib/products.ts`.
- Adicionar imagens de capa aos posts (`coverImage` no frontmatter).
- Configurar domínio e deploy (Vercel é o caminho mais direto para Next.js).
