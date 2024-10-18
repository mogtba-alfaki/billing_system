



import { generateUUID } from "../../helpers/generate_random_id";
import { InvoicesData } from "../../invoices/invoices_data";
import { PaymentGatewayIntegration } from "../../payment_gateway_integration/payment_gateway_integration";
import { PaymentFailureReasons, PaymentIntegrationStatuses } from "../../payment_gateway_integration/payment_gateway_integration_constants";
import { Payment, PaymentGatewayIntegrationChargePayment } from "../../types_interfaces/types";
import { PaymentData } from "../payments_data";


export class RetryFailedPayment {
  async retry(paymentId: string): Promise<Payment | null> {
    const payment = await PaymentData.getPaymentById(paymentId);

    if(!payment) {
      throw new Error('Payment not found');
    } 

    const invoiceId = payment.invoice_id;
    const invoice = await InvoicesData.getInvoiceById(invoiceId);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.payment_status == 'paid') {
      throw new Error('Invoice already paid');
    }


    // dummy payment integration dto 
    let paymentIntegrationDto = {
      amount: invoice.amount,
      cardNumber: '4242424242424242',
      cardExpMonth: '12',
      cardExpYear: '2029',
      cardCVC: '614',
    } as unknown as PaymentGatewayIntegrationChargePayment;

    let paymentStatus = {
      sucess: PaymentIntegrationStatuses.PENDING,
      failaur_reason: PaymentFailureReasons.NO_FAILURE_REASON,
    }

    try {

      let gatewayResponseStatus = await PaymentGatewayIntegration.charge(paymentIntegrationDto);

      if (gatewayResponseStatus === PaymentIntegrationStatuses.SUCCESS) {
        paymentStatus = {
          sucess: PaymentIntegrationStatuses.SUCCESS,
          failaur_reason: PaymentFailureReasons.NO_FAILURE_REASON,
        }
      } else {
        paymentStatus = {
          sucess: PaymentIntegrationStatuses.FAILURE,
          failaur_reason: PaymentFailureReasons.INTEGRATION_FAILURE,
        }
      }
    } catch (error) {
      paymentStatus = {
        sucess: PaymentIntegrationStatuses.FAILURE,
        failaur_reason: PaymentFailureReasons.NETWORK_FAILURE,
      }
    }

    if (paymentStatus.sucess && paymentStatus.failaur_reason == PaymentFailureReasons.NO_FAILURE_REASON) {
      let paymentDto = {
        id: generateUUID(),
        invoice_id: invoiceId,
        amount: invoice.amount,
        payment_date: new Date().toISOString(),
        payment_method: 'credit_card',
        payment_status: 'paid',
      } as Payment;

      const createdPayment = await PaymentData.createPayment(paymentDto);
      // update invoice status to paid
      await InvoicesData.updateInvoiceStatus(invoiceId, 'paid');
      return createdPayment;
    } else {
      // another failuer, return the existing failed payment
      return payment as unknown as Payment;
    }
  }
}