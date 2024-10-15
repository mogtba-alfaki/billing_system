import { generateUUID } from "../../helpers/generate_random_id";
import { Customer } from "../customer_interface";
import {Env} from '../../../worker-configuration.d.ts';


export class CreateCustomerUseCase {
    private readonly CustomerDataTag: string = 'customer:';

    async create(customerData: Customer) {
        // creating logic
        const { name, email, subscription_plan_id, subscription_status }: Customer = customerData;
        const id = generateUUID();
        const customer: Customer = { id, name, email, subscription_plan_id, subscription_status };
        Env.BILLING_KV.put(`${this.CustomerDataTag}${id}`, JSON.stringify(customer));
        return new Response(JSON.stringify(customer), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
}

