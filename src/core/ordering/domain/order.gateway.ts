import type { PlacedOrder, PricedOrder } from "./order";

/** Port: system that receives orders (Toast POS). */
export interface OrderGateway {
  placeOrder(order: PricedOrder): Promise<PlacedOrder>;
}
