import type { MenuRepository } from "@/core/menu/domain/menu.repository";
import { priceOrder, type OrderDraft, type PlacedOrder } from "../domain/order";
import type { OrderGateway } from "../domain/order.gateway";

/** Use case: validate a customer's order, price it from the current menu and send it to the POS. */
export function makePlaceOrder(gateway: OrderGateway, menuRepository: MenuRepository) {
  return async function placeOrder(draft: OrderDraft): Promise<PlacedOrder> {
    const order = priceOrder(draft, await menuRepository.getMenu());
    return gateway.placeOrder(order);
  };
}
