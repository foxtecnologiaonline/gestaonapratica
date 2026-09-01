# GestãoNaPrática

Máquina de conteúdo semanal sobre gestão: um site estático (Landing Page + Blog + página de Produtos) que roda em ciclos de 7 pilares — **Negócios, Pessoas, Financeira, IA, Marketing, Pública e Empresarial** — sempre conectando cada artigo a um post de LinkedIn e, quando faz sentido, a um produto digital low-ticket.

## Estrutura do projeto

```
/
├── index.html                  # Landing page principal
├── robots.txt
├── sitemap.xml
├── assets/
│   └── css/style.css           # Design system do site (cores, tipografia, componentes)
├── blog/
│   ├── index.html              # Listagem de artigos
│   └── *.html                  # Um artigo por arquivo (7 publicados)
├── produtos/
│   └── index.html              # Catálogo de produtos digitais low-ticket
└── content-system/             # O "motor" da máquina de conteúdo
    ├── CALENDAR.md              # Calendário editorial rotativo (ciclo 1 publicado + ciclo 2 planejado)
    ├── TEMPLATE-BLOG.md         # Estrutura para escrever qualquer novo artigo
    ├── TEMPLATE-LINKEDIN.md     # Estrutura para transformar o artigo em post de LinkedIn
    ├── PRODUCTS.md              # Catálogo de produtos + roadmap de novos produtos
    └── linkedin-posts/          # Os 7 posts de LinkedIn do ciclo 1, prontos para copiar/colar
```

É um site **100% estático, sem build, sem dependências e sem framework** — HTML e CSS puros. Isso significa deploy imediato em qualquer host estático (Vercel, Netlify, GitHub Pages, Cloudflare Pages) sem etapa de compilação.

## Como rodar localmente

Não há build. Basta abrir `index.html` no navegador, ou subir um servidor estático simples:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Como fazer deploy

Qualquer uma das opções abaixo funciona sem configuração adicional, pois não há passo de build:

- **GitHub Pages:** ative em Settings → Pages, apontando para a branch principal.
- **Netlify / Vercel:** conecte o repositório, deixe o "build command" vazio e o "publish directory" como raiz (`/`).
- **Cloudflare Pages:** mesma lógica — sem build command, diretório de saída na raiz.

Depois do deploy, ajuste:
1. O domínio real nas tags `<link rel="canonical">` e no `sitemap.xml` (hoje usam `https://gestaonapratica.com.br/` como placeholder).
2. O e-mail de contato (`contato@gestaonapratica.com.br`) para o e-mail profissional real.
3. O link do LinkedIn no rodapé para a página real da empresa/marca.

## Como funciona a máquina de conteúdo

1. **Um pilar por semana**, sempre na mesma ordem (ver `content-system/CALENDAR.md`) — evita dispersão e constrói repertório.
2. **Todo artigo já nasce com o post de LinkedIn junto**, escrito a partir do mesmo raciocínio (não é um resumo do artigo — é uma peça própria para o formato da rede).
3. **Todo artigo indica um produto digital relacionado**, quando existe um — conteúdo de autoridade sem oferta gera alcance, mas não receita.
4. Os templates em `content-system/TEMPLATE-BLOG.md` e `TEMPLATE-LINKEDIN.md` existem para que qualquer pessoa (não só quem criou o site) consiga produzir o próximo ciclo de conteúdo com o mesmo padrão de qualidade.

Para adicionar um novo artigo:
1. Copie a estrutura de um `.html` existente em `/blog/`.
2. Escreva o conteúdo seguindo `content-system/TEMPLATE-BLOG.md`.
3. Adicione o post de LinkedIn correspondente dentro do artigo (`<div class="linkedin-box">`) e também como arquivo separado em `content-system/linkedin-posts/`.
4. Adicione o card do novo artigo em `/blog/index.html` e a URL em `sitemap.xml`.
5. Atualize `content-system/CALENDAR.md` marcando a semana como publicada.

## Produtos digitais

A página `/produtos/` já está publicada com 7 produtos (um por pilar, formatos variados: checklist, template, planilha, e-book, mini-curso). **Os arquivos de entrega dos produtos ainda precisam ser produzidos** — a página hoje serve para validar interesse via e-mail (`mailto:`) antes de investir tempo produzindo cada material.

Próximos passos para vender de verdade, documentados em `content-system/PRODUCTS.md`:
1. Produzir o conteúdo de cada produto (PDF, planilha, vídeo).
2. Escolher uma plataforma de checkout (Hotmart, Kiwify ou Eduzz são as mais comuns no Brasil para low-ticket).
3. Trocar os links `mailto:` da página de produtos pelos links de checkout reais.

## Newsletter

O formulário de e-mail na home (`#newsletter`) hoje é um placeholder via `mailto:`. Para automatizar de verdade, conecte a um provedor de e-mail marketing (MailerLite, Mailchimp ou Beehiiv têm planos gratuitos para começar) e substitua o `<form>` pelo embed fornecido pela ferramenta.
