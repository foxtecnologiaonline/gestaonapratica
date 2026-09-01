import type { Post } from "@/lib/posts";

export type SeoLevel = "ok" | "warning" | "error";
export type SeoCheck = { label: string; level: SeoLevel; detail: string };

export function auditPost(post: Post): { score: number; checks: SeoCheck[] } {
  const checks: SeoCheck[] = [];

  const titleLen = post.frontmatter.title?.length || 0;
  checks.push({
    label: "Título",
    level:
      titleLen === 0
        ? "error"
        : titleLen > 60 || titleLen < 30
          ? "warning"
          : "ok",
    detail: `${titleLen} caracteres (ideal: 30-60)`,
  });

  const descLen = post.frontmatter.description?.length || 0;
  checks.push({
    label: "Meta descrição",
    level:
      descLen === 0
        ? "error"
        : descLen > 160 || descLen < 70
          ? "warning"
          : "ok",
    detail: `${descLen} caracteres (ideal: 70-160)`,
  });

  const tagCount = post.frontmatter.tags?.length || 0;
  checks.push({
    label: "Tags",
    level: tagCount === 0 ? "warning" : "ok",
    detail: `${tagCount} tag(s)`,
  });

  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  checks.push({
    label: "Tamanho do conteúdo",
    level: wordCount < 300 ? "warning" : "ok",
    detail: `${wordCount} palavras (~${Math.max(1, Math.round(wordCount / 200))} min de leitura)`,
  });

  checks.push({
    label: "Produto relacionado",
    level: post.frontmatter.relatedProduct ? "ok" : "warning",
    detail: post.frontmatter.relatedProduct
      ? "Vinculado a um produto digital"
      : "Nenhum produto linkado a este post",
  });

  const score = Math.round(
    (checks.filter((c) => c.level === "ok").length / checks.length) * 100,
  );

  return { score, checks };
}

export function siteWideChecks(): SeoCheck[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return [
    {
      label: "URL do site (NEXT_PUBLIC_SITE_URL)",
      level: siteUrl ? "ok" : "warning",
      detail: siteUrl
        ? siteUrl
        : "Não definida — sitemap.xml e robots.txt usam um domínio de exemplo até você configurar.",
    },
    {
      label: "Sitemap (sitemap.xml)",
      level: "ok",
      detail: "Gerado automaticamente a partir dos posts publicados.",
    },
    {
      label: "Robots (robots.txt)",
      level: "ok",
      detail: "Gerado automaticamente, bloqueando indexação de /admin.",
    },
    {
      label: "Verificação do Google Search Console",
      level: process.env.GOOGLE_SITE_VERIFICATION ? "ok" : "warning",
      detail: process.env.GOOGLE_SITE_VERIFICATION
        ? "Meta tag de verificação configurada."
        : "Defina GOOGLE_SITE_VERIFICATION para verificar o site no Search Console.",
    },
  ];
}
