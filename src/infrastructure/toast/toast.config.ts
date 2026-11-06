export type ToastConfig = {
  /** Toast API host provided by Toast (sandbox or production). */
  readonly apiHostname: string;
  readonly clientId: string;
  readonly clientSecret: string;
  /** GUID of the restaurant location in Toast. */
  readonly restaurantGuid: string;
};
