import { Header } from "@/components/public/header";

/**
 * Sem isto o padrão é `revalidate = false`: as páginas públicas que não usam
 * API de request-time (a home, e as de detalhe, que só leem `params`) são
 * prerenderizadas e ficam no cache de rota para sempre. O acervo vem de uma
 * API externa, então o HTML congelava no estado do banco na hora do build e
 * seguia mostrando obra já removida. Em dev nada disso aparece — lá a página
 * é sempre renderizada sob demanda.
 *
 * O valor mais baixo da rota vence, então declarar aqui cobre todas as
 * páginas públicas de uma vez.
 */
export const revalidate = 60;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1 px-5 lg:px-0">{children}</main>
    </>
  );
}
