import { getD1Database } from "..";
import { Payment } from "../types/types";
import { RetryFailedPayment } from "./usecases/retry_failed_payment";




export const failedPaymentsCronHandler = async () => {
  let d1Db = getD1Database();
  let failedPayments = await d1Db.prepare(`SELECT * FROM payments WHERE payment_status = 'failed'`)
  .all() as unknown as Payment[];
  
  if(!failedPayments || failedPayments.length == 0) {
    console.log("No Failed Payments To Retry");
    return;
  }

  const retryFailedPaymentUseCase = new RetryFailedPayment();
  for(let failedPayment of failedPayments) {
    await retryFailedPaymentUseCase.retry(failedPayment.invoice_id)
  }
}