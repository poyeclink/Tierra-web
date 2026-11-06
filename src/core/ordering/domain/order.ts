import { findMenuItem, type Menu } from "@/core/menu/domain/menu";
import { DomainError } from "@/core/shared/errors";
import { addMoney, money, multiplyMoney, type Money } from "@/core/shared/money";

export type OrderType = "pickup" | "dine-in";

export type OrderStatus = "received" | "in-progress" | "ready" | "completed" | "cancelled";

/** What the customer asks for. Prices are never accepted from the client. */
export type OrderLineRequest = {
  readonly menuItemId: string;
  readonly quantity: number;
  readonly notes?: string;
};

/** Line priced on the server from the current menu. */
export type OrderLine = OrderLineRequest & {
  readonly unitPrice: Money;
};

export type Customer = {
  readonly name: string;
  readonly phone?: string;
  readonly email?: string;
};

/** Order built by the customer, before being sent to the POS. */
export type OrderDraft = {
  readonly type: OrderType;
  readonly lines: readonly OrderLineRequest[];
  readonly customer: Customer;
  /** ISO 8601. Omit for "as soon as possible". */
  readonly scheduledFor?: string;
};

/** Validated draft, priced from the menu: what is sent to the POS. */
export type PricedOrder = Omit<OrderDraft, "lines"> & {
  readonly lines: readonly OrderLine[];
  readonly subtotal: Money;
};

/** Order accepted by the POS. */
export type PlacedOrder = {
  readonly id: string;
  readonly status: OrderStatus;
  readonly total: Money;
  readonly placedAt: string;
};

export function orderSubtotal(lines: readonly OrderLine[]): Money {
  if (lines.length === 0) throw new DomainError("Order has no lines");
  return lines
    .map((line) => multiplyMoney(line.unitPrice, line.quantity))
    .reduce((acc, value) => addMoney(acc, value), money(0, lines[0].unitPrice.currency));
}

export function assertValidOrderDraft(draft: OrderDraft): void {
  if (draft.lines.length === 0) throw new DomainError("Order must contain at least one item");
  if (draft.lines.some((l) => !Number.isInteger(l.quantity) || l.quantity < 1)) {
    throw new DomainError("Quantities must be positive integers");
  }
  if (!draft.customer.name.trim()) throw new DomainError("Customer name is required");
  if (!draft.customer.phone?.trim() && !draft.customer.email?.trim()) {
    throw new DomainError("A phone or email is required to contact the customer");
  }
  if (draft.scheduledFor !== undefined && Number.isNaN(Date.parse(draft.scheduledFor))) {
    throw new DomainError("scheduledFor must be an ISO 8601 date");
  }
}

/** Validates the draft and prices every line from `menu` (only available items). */
export function priceOrder(draft: OrderDraft, menu: Menu): PricedOrder {
  assertValidOrderDraft(draft);
  const lines = draft.lines.map((line): OrderLine => {
    const item = findMenuItem(menu, line.menuItemId);
    if (!item?.isAvailable) throw new DomainError(`Menu item ${line.menuItemId} is not available`);
    return { ...line, unitPrice: item.price };
  });
  return { ...draft, lines, subtotal: orderSubtotal(lines) };
}
