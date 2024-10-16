import { getD1Database } from "../..";
import { generateUUID } from "../../helpers/generate_random_id";
import { Plan } from "../../types_interfaces/types";



export class CreatePlanUseCase {
    constructor() {
    };

    async createPlan(planData: Plan) {
        const d1Db = getD1Database(); 

        const planId = generateUUID();
        await d1Db.prepare(`INSERT INTO plans (id, name, billing_cycle, price, status) VALUES (?, ?, ?, ?, ?)`)
        .bind(planId, planData.name, planData.billing_cycle, planData.price, planData.status)
        .first();

        return new Response('Plan Created', { status: 201 });
    }
}