import type { Metadata } from "next";
import { MenuCategoryNav } from "@/presentation/components/menu/menu-category-nav";
import { MenuCategorySection } from "@/presentation/components/menu/menu-category-section";
import { Container } from "@/presentation/components/ui/container";
import { PageHeader } from "@/presentation/components/ui/page-header";
import { Todo } from "@/presentation/components/ui/todo";
import { getMenu } from "@/presentation/data/menu";

export const metadata: Metadata = {
  title: "Menú",
};

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <>
      <PageHeader title="Menú" />
      <Container className="py-12">
        {menu.categories.length === 0 ? (
          <Todo>menú y precios pendientes (vendrán de Toast POS)</Todo>
        ) : (
          <>
            <MenuCategoryNav categories={menu.categories} />
            <div className="mt-12 space-y-16">
              {menu.categories.map((category) => (
                <MenuCategorySection key={category.id} category={category} />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
