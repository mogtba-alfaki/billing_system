import { getD1Database } from "../..";
import { generateUUID } from "../../helpers/generate_random_id";
import { Plan } from "../../types_interfaces/types";
import { PlansData } from "../plans_data";



export class CreatePlanUseCase {
    constructor() {
    };

    async createPlan(planData: Plan) {
        return PlansData.createPlan(planData);
    }
}