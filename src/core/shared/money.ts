import { DomainError } from "./errors";

/**
 * Monetary value stored in minor units (cents) to avoid floating point errors.
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

/** Builds Money from a major-unit value such as 4.5 -> 450 cents. */
export function moneyFromMajorUnits(value: number, currency: string): Money {
  return money(Math.round(value * 100), currency);
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
