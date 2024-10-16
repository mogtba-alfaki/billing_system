import { getD1Database } from "../..";
import Env from "../../index";
import { generateUUID } from "../../helpers/generate_random_id";
import { Customer } from "../customer_interface";

export class CreateCustomerUseCase {
    private readonly CustomerDataTag: string = 'customer:';

    async create(customerData: Customer) {
        const d1Db = getD1Database();
        const id = generateUUID();
         await d1Db.prepare(`INSERT INTO customers (id, name, email) VALUES (?, ?, ?)`)  
        .bind(id, customerData.name, customerData.email)
        .first();
        
        const createdCustomer = await d1Db.prepare(`SELECT * FROM customers WHERE id = ?`).bind(id).first();
        
        // const createdCustomer =  await dataProvider.get(`${this.CustomerDataTag}${id}`);
         return new Response(JSON.stringify(createdCustomer));
    }
}

