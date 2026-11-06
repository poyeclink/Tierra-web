export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** Times in 24h "HH:mm" format, local to the establishment. */
export type OpeningHours = {
  readonly day: Weekday;
  readonly opens: string;
  readonly closes: string;
};

export type Address = {
  readonly line1: string;
  readonly line2?: string;
  readonly city: string;
  readonly state?: string;
  readonly postalCode?: string;
  readonly country: string;
  readonly mapUrl?: string;
};

export type Principle = {
  readonly title: string;
  readonly description: string;
};

/**
 * Business data comes from the client. Optional fields are pending
 * and the UI must show a visible TODO instead of inventing values.
 */
export type Establishment = {
  readonly name: string;
  readonly tagline?: string;
  readonly description: string;
  readonly mission: string;
  readonly vision: string;
  readonly principles: readonly Principle[];
  /** Sister brand of the same franchise. */
  readonly sisterBrand?: { readonly name: string; readonly url?: string };
  readonly address?: Address;
  readonly contact?: { readonly phone?: string; readonly email?: string };
  readonly social?: {
    readonly instagram?: string;
    readonly facebook?: string;
    readonly tiktok?: string;
  };
  /** Empty = not provided yet. Once provided, days not listed are closed. */
  readonly openingHours: readonly OpeningHours[];
};
