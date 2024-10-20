import { getD1Database } from "..";
import { CustomerSubscription } from "../types/types";
import { GenerateSubscriptionInvoice } from "./usecases/generate_subscription_invoice";



export const generateInvoicesCornHandler = async () => {
  const d1Db = getD1Database();
  const customerSubscriptions = await d1Db
  .prepare(`SELECT * FROM customer_subscriptions WHERE status = 'active' and end_date <= ?`)
  .bind(new Date())
  .all() as unknown as CustomerSubscription[];

  if(!customerSubscriptions || customerSubscriptions.length == 0) {
    console.log("No Subscriptions To Generate Invoice For");
    return;
  }
  const generateInvoiceUseCase = new GenerateSubscriptionInvoice();
  for(let subscription of customerSubscriptions) {
      await generateInvoiceUseCase.generate(subscription.customer_id)
  }

}