import { SiteFooter } from "@/presentation/components/layout/site-footer";
import { SiteHeader } from "@/presentation/components/layout/site-header";
import { getEstablishment } from "@/presentation/data/establishment";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const establishment = await getEstablishment();
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter establishment={establishment} />
    </>
  );
}
