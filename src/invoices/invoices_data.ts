import { getD1Database } from "..";
import { Invoice } from "../types/types"


let createInvoice = async (invoice: Invoice): Promise<Invoice | null> => {
  const d1Db = getD1Database();
  await d1Db.prepare(`
      INSERT INTO invoices (id, customer_id, amount, due_date, payment_status, payment_date) 
      VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(invoice.id, invoice.customer_id, invoice.amount, invoice.due_date, invoice.payment_status, invoice.payment_date)
    .first();

  return d1Db.prepare(`SELECT * FROM invoices where id = ?`).bind(invoice.id).first();
}


let getSubscriptionInvoice = async (customerSubscriptionId: string)  => {
  const d1Db = getD1Database();
  return d1Db.prepare(`SELECT * FROM invoices WHERE customer_id = ? AND payment_status = 'Pending'`).bind(customerSubscriptionId).first();
}

let getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  const d1Db = getD1Database();
  return d1Db.prepare(`SELECT * FROM invoices WHERE id = ?`).bind(invoiceId).first();
}

let updateInvoiceStatus = async (invoiceId: string, status: string): Promise<Invoice | null> => {
  const d1Db = getD1Database();
  return d1Db.prepare(`UPDATE invoices SET payment_status = ? WHERE id = ?`).bind(status, invoiceId).first();
}



export const InvoicesData = {
  createInvoice,
  getInvoiceById,
  getSubscriptionInvoice,
  updateInvoiceStatus,
}