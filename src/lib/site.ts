/**
 * Identidade e URL base do site, usadas em metadataBase, canônicas, sitemap,
 * robots e nas imagens de compartilhamento.
 */

export const SITE_NAME = "Cine Paca";
export const SITE_TAGLINE = "Cinemateca Educacional";

export const SITE_DESCRIPTION =
  "Acervo de curtas, documentários e animações brasileiras com curadoria pedagógica: sinopse, faixa etária, etapa de ensino, habilidades da BNCC e classificação indicativa para planejar aulas com segurança.";

/**
 * Resolvida em camadas, da mais explícita para a mais genérica:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — para quando houver domínio próprio apontando
 *    para o deploy, já que a variável da Vercel continua trazendo o
 *    *.vercel.app nesse caso.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — domínio estável de produção da Vercel
 *    (só o host, sem protocolo). Diferente de `VERCEL_URL`, que muda a cada
 *    deploy e faria a canônica apontar para um preview.
 * 3. localhost, para desenvolvimento.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return new URL(explicit.startsWith("http") ? explicit : `https://${explicit}`);
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) {
    return new URL(`https://${vercel}`);
  }

  return new URL("http://localhost:3000");
}

/** URL absoluta a partir de um caminho começando com "/". */
export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
