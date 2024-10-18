import { getD1Database } from "..";
import { Payment } from "../types_interfaces/types";



export const createPayment = async (paymentDto: Payment): Promise<Payment | null> => {
  const d1Db = getD1Database();
  const payment = await d1Db.prepare(`
      INSERT INTO payments (id, invoice_id, amount, payment_date, payment_method, payment_status) 
      VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(
      paymentDto.id, paymentDto.invoice_id, paymentDto.amount, paymentDto.payment_date,
      paymentDto.payment_method, paymentDto.payment_status)
    .first();
    
  return d1Db.prepare(`SELECT * FROM payments where id = ?`).bind(paymentDto.id).first();
}


export const getFailedPaymentByInvoiceId = async (invoiceId: string) => {
  const d1Db = getD1Database();
  return d1Db.prepare(`SELECT * FROM payments WHERE invoice_id = ? AND payment_status = 'failed'`)
  .bind(invoiceId).first();
}


export const PaymentData = {
  createPayment,
  getFailedPaymentByInvoiceId,
}