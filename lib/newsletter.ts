export type SubscribeResult = { ok: true } | { ok: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Ponto único de integração com o provedor de e-mail (ESP).
 *
 * Ainda não há um ESP definido. Quando escolher um (ConvertKit/Kit, Resend, etc.),
 * troque o corpo desta função pela chamada real à API do provedor, usando uma
 * variável de ambiente para a chave (ex. process.env.NEWSLETTER_API_KEY).
 * Nenhum outro arquivo do projeto precisa mudar.
 */
export async function subscribeToNewsletter(
  email: string,
): Promise<SubscribeResult> {
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: "E-mail inválido." };
  }

  // TODO: substituir por chamada ao ESP escolhido, por exemplo:
  // await fetch("https://api.convertkit.com/v3/forms/FORM_ID/subscribe", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ api_key: process.env.NEWSLETTER_API_KEY, email }),
  // });

  console.log(`[newsletter] novo cadastro (stub, não enviado a nenhum ESP): ${email}`);

  return { ok: true };
}
