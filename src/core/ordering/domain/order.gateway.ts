import type { OrderDraft, PlacedOrder } from "./order";

/** Port: system that receives orders (Toast POS). */
export interface OrderGateway {
  placeOrder(draft: OrderDraft): Promise<PlacedOrder>;
}
