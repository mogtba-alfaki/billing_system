import { getD1Database } from "..";
import { Payment } from "../types/types";
import { RetryFailedPayment } from "./usecases/retry_failed_payment";




export const failedPaymentsCronHandler = async () => {
  let d1Db = getD1Database();
  let failedPayments = await d1Db.prepare(`SELECT * FROM payments WHERE payment_status = 'failed'`)
  .all() as unknown as Payment[];
  
  const retryFailedPaymentUseCase = new RetryFailedPayment();
  for(let failedPayment of failedPayments) {
    await retryFailedPaymentUseCase.retry(failedPayment.invoice_id)
  }
}