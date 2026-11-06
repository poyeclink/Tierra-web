import { DomainError } from "./errors";

/**
 * Monetary value stored in minor units (cents for USD) to avoid floating point errors.
 * `currency` is an ISO 4217 code, e.g. "USD".
 */
export type Money = {
  readonly amount: number;
  readonly currency: string;
};

export function money(amount: number, currency: string): Money {
  if (!Number.isInteger(amount)) {
    throw new DomainError(`Money amount must be an integer in minor units, got ${amount}`);
  }
  return { amount, currency };
}

/** Decimal places of a currency's minor unit (USD 2, JPY 0, KWD 3). */
export function minorUnitDigits(currency: string): number {
  return new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

/** Builds Money from a major-unit value such as 4.5 USD -> 450 cents. */
export function moneyFromMajorUnits(value: number, currency: string): Money {
  return money(Math.round(value * 10 ** minorUnitDigits(currency)), currency);
}

/** Major-unit value of Money, e.g. 450 cents -> 4.5 USD. */
export function toMajorUnits(value: Money): number {
  return value.amount / 10 ** minorUnitDigits(value.currency);
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new DomainError(`Cannot add ${a.currency} and ${b.currency}`);
  }
  return money(a.amount + b.amount, a.currency);
}

export function multiplyMoney(value: Money, factor: number): Money {
  return money(Math.round(value.amount * factor), value.currency);
}
