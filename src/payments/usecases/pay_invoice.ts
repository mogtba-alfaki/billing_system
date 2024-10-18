import { CustomerData } from "../../customer/customer_data";
import { EmailService } from "../../helpers/email_service";
import { generateUUID } from "../../helpers/generate_random_id";
import { InvoicesData } from "../../invoices/invoices_data";
import { PaymentGatewayIntegration } from "../../payment_gateway_integration/payment_gateway_integration";
import { PaymentFailureReasons, PaymentIntegrationStatuses } from "../../payment_gateway_integration/payment_gateway_integration_constants";
import { Payment, PaymentGatewayIntegrationChargePayment } from "../../types/types";
import { PaymentData } from "../payments_data";


export class PayInvoiceUseCase {
  async pay(invoiceId: string): Promise<Payment | null> {
    const invoice = await InvoicesData.getInvoiceById(invoiceId);
    console.log(`Proceeding Paying Invoice`);
    console.log(invoice);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    if (invoice.payment_status == 'paid') {
      throw new Error(`Invoice already paid`);
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

    // call gateway integration and record the payment status
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

      // update the invoice status and notify customer
      await InvoicesData.updateInvoiceStatus(invoiceId, 'paid');
      const customerEmail  = (await CustomerData.getCustomerById(invoice.customer_id))?.email as string;
      await EmailService.sendPaymentSuccessEmail(customerEmail, invoiceId);

      return createdPayment;
    } else {
      let paymentDto = {
        id: generateUUID(),
        invoice_id: invoiceId,
        amount: invoice.amount,
        payment_date: new Date().toISOString(),
        payment_method: 'credit_card',
        payment_status: 'failed',
      } as Payment;

      // a cron will handle a retries for this payment later
      const failedPayment = await PaymentData.createPayment(paymentDto);
      await InvoicesData.updateInvoiceStatus(invoiceId, 'failed');

      // send payment failed email to the customer
      const customerEmail  = (await CustomerData.getCustomerById(invoice.customer_id))?.email as string;
      await EmailService.sendPaymentFailedEmail(customerEmail, invoiceId);
      
      return failedPayment;
    }
  }
}