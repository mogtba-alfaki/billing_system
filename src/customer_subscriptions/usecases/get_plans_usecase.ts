

import { getD1Database } from "../..";
import { generateUUID } from "../../helpers/generate_random_id";
import { Plan } from "../../types_interfaces/types";



export class GetCustomerSubscriptionsUseCase {
    constructor() {
    };

    async all() {
        const d1Db = getD1Database(); 

        const data = await d1Db.prepare(`SELECT * FROM customer_subscriptions`).first();
        console.log(data); 
        return data;
    } 

    
    async byCustomerId(customerId: string) {
        const d1Db = getD1Database(); 

        const data = await d1Db.prepare(`SELECT * FROM customer_subscriptions WHERE customer_id = ? AND customer_subscriptions.status = 'active'`).bind(customerId).first();
        console.log(data); 
        return data;
    }
}