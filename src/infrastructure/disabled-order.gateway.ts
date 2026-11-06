import type { OrderGateway } from "@/core/ordering/domain/order.gateway";

/** Used while online ordering is turned off (ORDER_PROVIDER=none). */
export const disabledOrderGateway: OrderGateway = {
  async placeOrder() {
    throw new Error("Online ordering is disabled.");
  },
};
