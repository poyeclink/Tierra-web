import { availableMenu, type Menu } from "../domain/menu";
import type { MenuRepository } from "../domain/menu.repository";

/** Use case: public menu shown to customers (only available items). */
export function makeGetMenu(repository: MenuRepository) {
  return async function getMenu(): Promise<Menu> {
    return availableMenu(await repository.getMenu());
  };
}
