import { CustomerData } from "../../customer/customer_data";
import { EmailService } from "../../helpers/email_service";
import { generateUUID } from "../../helpers/generate_random_id";
import { InvoicesData } from "../../invoices/invoices_data";
import { CustomerSubscription, Invoice } from "../../types/types";
import { CustomerSubscriptionData } from "../customer_subscriptions_data";



export class CancelCustomerSubscription {
  constructor() {
  }
    async cancel(customerId: string): Promise<Invoice> {
      const customer = await CustomerData.getCustomerById(customerId);
      const subscription = await CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId(customerId) as unknown as CustomerSubscription;

      if (!customer) {
        throw new Error('Customer not found');
      } 

      if (!subscription) {
        throw new Error('Customer has no active subscriptions');
      }

      const calculateProratedAmount = this.calculateProRatedAmount(subscription.end_date, subscription.price, subscription.billing_cycle);


      const invoiceDto = {
        id: generateUUID(),
        customer_id: customerId,
        amount: calculateProratedAmount,
        due_date: new Date().toISOString(),
        payment_status: 'Pending',
        payment_date: new Date().toISOString()
      } as unknown as Invoice;

      console.log(invoiceDto)
      let createdInvoice = (await InvoicesData.createInvoice(invoiceDto)) as unknown as Invoice;
      await EmailService.sendInvoiceGeneratedEmail(customer.email, createdInvoice);
      await CustomerSubscriptionData.updateCustomerSubscriptionStatus(customerId, 'cancelled');
      return createdInvoice;
    }

    private  calculateProRatedAmount(subscriptionEndDate: string, subscriptionPrice: number, subscriptionCycle: string) {
      let proratedPaymentFactor = 1.5;  // a fee factor to be applied to the subscription price when cancelled before the end date
      
      const currentDate = new Date(); 
    
      const timeDifference = new Date(subscriptionEndDate).getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
      if (daysDifference <= 0) {
        return 0;
      } 
    
      if(subscriptionCycle === 'yearly') { 
        // increase proratedPaymentent factor deduction for cancelling yearly subscriptions
        proratedPaymentFactor = 1.7;
      }
    
      const dailyPrice = subscriptionPrice / 30;
      let cycleSubscriptionPrice = dailyPrice * daysDifference;
      const amount = cycleSubscriptionPrice * proratedPaymentFactor;
    
      // round the number to 2 decimal points eg: 14.35 
      const roundedAmount = Math.round(amount * 100) / 100;

      /* 
          handel the case of amount beign greater than the subscription price 
          in the case of canceling subscription in the first days the amount will be 
          greater that the price it'self due to the multiplication againest the prorated factor
          so we will return the amount devided by 2 to be fair to the customer
      */ 

      if(roundedAmount > subscriptionPrice) {
          return roundedAmount / 2;
      } 

      return roundedAmount;
    }
}