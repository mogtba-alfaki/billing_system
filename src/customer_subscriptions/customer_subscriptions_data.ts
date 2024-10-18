import { getD1Database, getKvStore } from "..";
import { CustomerSubscription } from "../types/types";



let getActiveCustomerSubscriptionByCustomerId = async (customerId: string) => {
  // check the cached first if it's exist  
  const kvStore = getKvStore(); 
  const cachedSubscriptionFound = await kvStore.get(customerId);

  if(cachedSubscriptionFound) {
    return JSON.parse(cachedSubscriptionFound);
  }

  const d1Db = getD1Database();
  const data = await d1Db.prepare(`SELECT * FROM customer_subscriptions WHERE customer_id = ? AND customer_subscriptions.status = 'active'`).bind(customerId).first();
  
  await kvStore.put(customerId, JSON.stringify(data));
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

  const createdSubscription = await d1Db.prepare(`SELECT * FROM customer_subscriptions where id = ?`).bind(customerSubscriptionDto.id).first();
  const kvStore = getKvStore();
  await kvStore.put(customerSubscriptionDto.customer_id, JSON.stringify(createdSubscription));
  return createdSubscription;
}

let getAllCustomersSubscriptions = async () => {
  const d1Db = getD1Database();
  const data = await  d1Db.prepare(`SELECT * FROM customer_subscriptions`).all(); 
  return data.results;
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