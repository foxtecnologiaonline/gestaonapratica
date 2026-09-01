import { getGaMeasurementId, isGaConfigured } from "@/lib/analytics";

export default function AdminAnalyticsPage() {
  const connected = isGaConfigured();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Analytics</h1>

      <div
        className={`mb-6 rounded-lg border p-5 ${
          connected ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
        }`}
      >
        <p className={`font-semibold ${connected ? "text-green-800" : "text-amber-800"}`}>
          {connected
            ? `Google Analytics conectado (${getGaMeasurementId()})`
            : "Google Analytics não conectado"}
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          {connected
            ? "O script de rastreamento está ativo em todas as páginas do site."
            : "Defina NEXT_PUBLIC_GA_MEASUREMENT_ID nas variáveis de ambiente para ativar o rastreamento."}
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-2 font-semibold text-brand-dark">Como conectar</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-600">
          <li>
            Crie uma propriedade GA4 em{" "}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              analytics.google.com
            </a>{" "}
            e copie o Measurement ID (formato G-XXXXXXX).
          </li>
          <li>
            Defina a variável de ambiente{" "}
            <code className="rounded bg-neutral-100 px-1">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>{" "}
            com esse valor no seu provedor de hospedagem (ex. Vercel).
          </li>
          <li>Faça um novo deploy — o script passa a carregar automaticamente em todas as páginas.</li>
        </ol>
        <p className="mt-4 text-sm text-neutral-500">
          Números de visitas, origem de tráfego e conversão ficam disponíveis diretamente no
          painel do Google Analytics. Trazer esses números para dentro deste admin exigiria
          conectar a API do Google com credenciais próprias — dá pra implementar depois, se fizer
          sentido pra você.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-2 font-semibold text-brand-dark">Google Search Console</h2>
        <p className="text-sm text-neutral-600">
          Defina <code className="rounded bg-neutral-100 px-1">GOOGLE_SITE_VERIFICATION</code>{" "}
          com o código de verificação (meta tag) fornecido pelo Search Console para confirmar a
          propriedade do site. Ele é injetado automaticamente no <code>&lt;head&gt;</code> do
          site quando definido.
        </p>
      </div>
    </div>
  );
}
