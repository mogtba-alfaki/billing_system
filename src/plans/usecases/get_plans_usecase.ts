

import { getD1Database } from "../..";
import { generateUUID } from "../../helpers/generate_random_id";
import { Plan } from "../../types/types";
import { PlansData } from "../plans_data";



export class GetPlanUseCase {
    constructor() {
    };

    async all() {
        return PlansData.getAllPlans();
    }
}