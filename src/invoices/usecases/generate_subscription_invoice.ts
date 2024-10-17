import { CustomerSubscriptionData } from "../../customer_subscriptions/customer_subscriptions_data";
import { generateUUID } from "../../helpers/generate_random_id";
import { Invoice } from "../../types_interfaces/types";
import { InvoicesData } from "../invoices_data";



export class GenerateSubscriptionInvoice {
    async generate(customerId: string) {
      const customerSubscription = await CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId(customerId);

      if (!customerSubscription) {
        throw new Error('Customer has no active subscriptions');
      }

        // validate the subscription to be active + end time is reached + no previous invoices payed for the same subscription

        if(customerSubscription.status !== 'active'){
          throw new Error('Subscription is not active');
        }

        if(new Date(customerSubscription.end_date as string) > new Date()){
          throw new Error('Subscription is not ended yet, please cancel or change plan to generate mid invoice');
        }

        const invoiceDto = {
          id: generateUUID(),
          customer_id: customerId,
          amount: customerSubscription.price,
          due_date: new Date().toISOString(), // add a time buffer as needed here eg: current date + 3 days
          payment_status: 'Pending',
          payment_date: new Date().toISOString() 
        } as unknown as Invoice;
        
       let createdInvoice = await InvoicesData.createInvoice(invoiceDto);
       

       // todo:  notify the user with an email 
      return createdInvoice;
    }
}