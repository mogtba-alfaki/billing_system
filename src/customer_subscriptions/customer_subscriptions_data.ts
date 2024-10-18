import { getD1Database } from "..";
import { CustomerSubscription } from "../types_interfaces/types";



let getActiveCustomerSubscriptionByCustomerId = async (customerId: string) => {
  const d1Db = getD1Database();

  const data = await d1Db.prepare(`SELECT * FROM customer_subscriptions WHERE customer_id = ? AND customer_subscriptions.status = 'active'`).bind(customerId).first();
  return data;
}


let createCustomerSubscription = async (customerSubscriptionDto: CustomerSubscription) => {
  const d1Db = getD1Database();
  const customerSubscription = await d1Db.prepare(`
      INSERT INTO customer_subscriptions (id, customer_id, plan_id, billing_cycle, price, name, status, start_date, end_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      customerSubscriptionDto.id, customerSubscriptionDto.customer_id, customerSubscriptionDto.plan_id, customerSubscriptionDto.billing_cycle,
      customerSubscriptionDto.price, customerSubscriptionDto.name, 'active', customerSubscriptionDto.start_date, customerSubscriptionDto.end_date)
    .first();

  return d1Db.prepare(`SELECT * FROM customer_subscriptions where id = ?`).bind(customerSubscriptionDto.id).first();
}

let getAllCustomersSubscriptions = async () => {
  const d1Db = getD1Database();
  return d1Db.prepare(`SELECT * FROM customer_subscriptions`).first();
}

let updateCustomerSubscriptionStatus = async (customerId: string, status: string) => {
  const d1Db = getD1Database();
  return d1Db.prepare(`UPDATE customer_subscriptions SET status = ? WHERE customer_id = ?`)
  .bind(status, customerId)
  .run();
}


export const CustomerSubscriptionData = {
  getActiveCustomerSubscriptionByCustomerId,
  createCustomerSubscription,
  getAllCustomersSubscriptions,
  updateCustomerSubscriptionStatus,
}