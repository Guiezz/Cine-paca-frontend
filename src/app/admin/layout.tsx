import type { Metadata } from "next";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

/**
 * Server component apenas para poder declarar metadata — o shell com a
 * verificação de sessão continua client.
 *
 * O robots.txt desencoraja rastrear /admin, mas não impede a indexação de uma
 * URL que apareça em outro lugar; noindex é o que garante.
 */
export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
