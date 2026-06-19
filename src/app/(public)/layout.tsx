import { Header } from "@/components/public/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1 px-5 lg:px-0">{children}</main>
    </>
  );
}
