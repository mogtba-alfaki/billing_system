export enum PaymentIntegrationStatuses {
  PENDING = 0,
  SUCCESS = 1,
  FAILURE = 2,
}

export enum PaymentFailureReasons {
  NO_FAILURE_REASON =  -1,
  INTEGRATION_FAILURE = 0,
  NETWORK_FAILURE = 1,
}