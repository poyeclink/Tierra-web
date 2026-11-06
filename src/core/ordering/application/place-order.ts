import { assertValidOrderDraft, type OrderDraft, type PlacedOrder } from "../domain/order";
import type { OrderGateway } from "../domain/order.gateway";

export function makePlaceOrder(gateway: OrderGateway) {
  return async function placeOrder(draft: OrderDraft): Promise<PlacedOrder> {
    assertValidOrderDraft(draft);
    return gateway.placeOrder(draft);
  };
}
