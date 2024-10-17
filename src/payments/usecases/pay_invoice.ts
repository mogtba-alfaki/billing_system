import { generateUUID } from "../../helpers/generate_random_id";
import { InvoicesData } from "../../invoices/invoices_data";
import { PaymentGatewayIntegration } from "../../payment_gateway_integration/payment_gateway_integration";
import { Payment, PaymentGatewayIntegrationChargePayment } from "../../types_interfaces/types";
import { PaymentData } from "../payments_data";


class PayInvoiceUseCase {
  async pay(invoiceId: string): Promise<Payment | null> {
    const invoice = await InvoicesData.getInvoiceById(invoiceId);

    if(!invoice){
      throw new Error('Invoice not found');
    } 

    if(invoice.payment_status == 'paid'){
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

    try {
       let gatewayResponseStatus = await PaymentGatewayIntegration.charge(paymentIntegrationDto);
       if(gatewayResponseStatus === PaymentGatewayIntegration.PaymentIntegrationStatuses.SUCCESS){
       } else {
        throw new Error('Payment failed');
       }
    } catch(error) {
      // insert a record in failed payments talbe
      throw new Error('Payment failed');
    }


    // make the payment
    let paymentDto = {
      id: generateUUID(),
      invoice_id: invoiceId,
      amount: invoice.amount,
      payment_date: new Date().toISOString(),
      payment_method: 'credit_card',
      payment_status: 'paid',
    } as Payment;  

    const createdPayment = await PaymentData.createPayment(paymentDto);
    
    // update the invoice status
    await InvoicesData.updateInvoiceStatus(invoiceId, 'paid');
    
    return createdPayment;
  }
}