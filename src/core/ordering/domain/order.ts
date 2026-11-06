import { DomainError } from "@/core/shared/errors";
import { addMoney, money, multiplyMoney, type Money } from "@/core/shared/money";

export type OrderType = "pickup" | "dine-in";

export type OrderStatus = "received" | "in-progress" | "ready" | "completed" | "cancelled";

export type OrderLine = {
  readonly menuItemId: string;
  readonly quantity: number;
  readonly unitPrice: Money;
  readonly notes?: string;
};

export type Customer = {
  readonly name: string;
  readonly phone?: string;
  readonly email?: string;
};

/** Order built by the customer, before being sent to the POS. */
export type OrderDraft = {
  readonly type: OrderType;
  readonly lines: readonly OrderLine[];
  readonly customer: Customer;
  /** ISO 8601. Omit for "as soon as possible". */
  readonly scheduledFor?: string;
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
  if (!draft.customer.phone && !draft.customer.email) {
    throw new DomainError("A phone or email is required to contact the customer");
  }
}
