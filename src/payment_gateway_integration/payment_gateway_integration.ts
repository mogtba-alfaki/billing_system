

// import here a payment gateway integration eg: stripe
// import { PaymentGateway } from './stribe'

import { PaymentGatewayIntegrationChargePayment } from "../types/types";
import { PaymentIntegrationStatuses } from "./payment_gateway_integration_constants";


// implement here some functions to pay and to check for payment status , please mitigate stripe style 


let charge = async (chargePaymentDto: PaymentGatewayIntegrationChargePayment) => {
/*
  here we should call stripe api to charge the card
  i will simulate the charge and return either sucess or failure randomly 
  to be able to test failure transaction and implement retries
*/

  let random = Math.floor(Math.random() * 10);
  if (random % 2 == 0) {
    return PaymentIntegrationStatuses.SUCCESS;
  } else {
    return PaymentIntegrationStatuses.FAILURE;
  }
}


let getPaymentStatus = async (paymentId: string) => {
  return PaymentIntegrationStatuses.SUCCESS;
}


export const PaymentGatewayIntegration = {
  charge,
  getPaymentStatus,
};
