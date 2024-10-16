import { getD1Database } from "../..";
import { generateUUID } from "../../helpers/generate_random_id";
import { AssignCustomerToPlan, Plan } from "../../types_interfaces/types";



export class AssignCustomerToPlanUseCase {
    constructor() {
    };

    async assign(assignData: AssignCustomerToPlan) {
        const d1Db = getD1Database(); 

        const planFound = await d1Db.prepare(`SELECT * FROM plans WHERE id = ?`).bind(assignData.plan_id).first();
        const customerFound = await d1Db.prepare(`SELECT * FROM customers WHERE id = ?`).bind(assignData.customer_id).first();


        if(!customerFound) {
            throw new Error('Customer not found');
        }

        if(!planFound) {
            throw new Error('Plan not found');
        }

        const customerSubscriptionId = generateUUID();
        const planBillingCycle = planFound.billing_cycle;
        const planPrice = planFound.price;
        const planName = planFound.name;

        let planStartDate = new Date(); 
        let planEndDate; 
        if(planFound.billing_cycle === 'monthly') {
            console.log("monthly -----------------------");
            planEndDate = new Date(planStartDate.setMonth(planStartDate.getMonth() + 1)).toISOString();
        } else if(planFound.billing_cycle === 'yearly') {
            console.log("yearly -----------------------");
            planEndDate = new Date(planStartDate.setFullYear(planStartDate.getFullYear() + 1)).toISOString();
        }   

        console.log(planStartDate.toISOString(), planEndDate);

        const customerSubscription = await d1Db.prepare(`
                INSERT INTO customer_subscriptions (id, customer_id, plan_id, billing_cycle, price, name, status, start_date, end_date) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                .bind(customerSubscriptionId, assignData.customer_id, assignData.plan_id, planBillingCycle, planPrice, planName, 'active', planStartDate.toISOString(), planEndDate) 
                .first();

        const createdSubscription = await d1Db.prepare(`SELECT * FROM customer_subscriptions where id = ?`).bind(customerSubscriptionId).first();


        return new Response(JSON.stringify(createdSubscription));
    }
}