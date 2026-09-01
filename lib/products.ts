export type Product = {
  slug: string;
  title: string;
  description: string;
  price: string;
  /** Link de checkout da Hotmart para este produto. Troque pelo link real assim que o produto for publicado na Hotmart. */
  hotmartUrl: string;
  coverImage?: string;
  badge?: string;
};

/**
 * Catálogo de produtos digitais.
 *
 * Cada produto é vendido e entregue pela Hotmart (checkout, pagamento via PIX/boleto/cartão,
 * nota fiscal e área de membros ficam por conta da plataforma). Aqui só guardamos os dados
 * de vitrine e o link de checkout.
 *
 * Para publicar um produto novo:
 * 1. Crie o produto na Hotmart e copie o link de checkout.
 * 2. Adicione um item abaixo com esse link em `hotmartUrl`.
 * 3. Referencie o `slug` do produto no frontmatter do post relacionado (`relatedProduct`).
 */
export const products: Product[] = [
  {
    slug: "planilha-fluxo-de-caixa",
    title: "Planilha de Fluxo de Caixa Simplificado",
    description:
      "Planilha pronta para controlar entradas, saídas e projeção de caixa do seu negócio, sem precisar entender de fórmulas complexas.",
    price: "R$ 47",
    hotmartUrl: "https://pay.hotmart.com/SEU-CODIGO-AQUI-1",
    badge: "Mais vendido",
  },
  {
    slug: "guia-precificacao",
    title: "Guia Prático de Precificação",
    description:
      "Passo a passo para calcular o preço ideal dos seus produtos e serviços considerando custos, margem e mercado.",
    price: "R$ 37",
    hotmartUrl: "https://pay.hotmart.com/SEU-CODIGO-AQUI-2",
  },
  {
    slug: "template-plano-de-acao-90-dias",
    title: "Template de Plano de Ação 90 Dias",
    description:
      "Estrutura editável para organizar metas trimestrais, indicadores e responsáveis em uma gestão mais previsível.",
    price: "R$ 27",
    hotmartUrl: "https://pay.hotmart.com/SEU-CODIGO-AQUI-3",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
