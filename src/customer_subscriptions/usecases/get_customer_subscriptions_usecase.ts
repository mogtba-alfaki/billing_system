

import { getD1Database } from "../..";
import { generateUUID } from "../../helpers/generate_random_id";
import { Plan } from "../../types_interfaces/types";
import { CustomerSubscriptionData } from "../customer_subscriptions_data";



export class GetCustomerSubscriptionsUseCase {
    constructor() {
    };

    async all() {
        return CustomerSubscriptionData.getAllCustomersSubscriptions();
    } 

    
    async byCustomerId(customerId: string) {
        return CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId(customerId);
    }
}