import { getD1Database } from ".."
import { generateUUID } from "../helpers/generate_random_id";
import { Customer } from "../types/types";


let getCustomerById = async (customerId: string): Promise<Customer | null> => {
  const d1Db = await getD1Database();
  return d1Db.prepare('SELECT * FROM customers WHERE id = ?')
  .bind(customerId)
  .first() as unknown as Customer;
}


let createCustomer = async (customerData: Customer): Promise<Customer | null> => {
  const d1Db = getD1Database();
  const id = generateUUID();
   await  d1Db.prepare(`INSERT INTO customers (id, name, email) VALUES (?, ?, ?)`)  
  .bind(id, customerData.name, customerData.email)
  .first();
  return getCustomerById(id);
}




export const CustomerData = {
  getCustomerById,
  createCustomer
}