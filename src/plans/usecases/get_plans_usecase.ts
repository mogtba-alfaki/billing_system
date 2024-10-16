

import { getD1Database } from "../..";
import { generateUUID } from "../../helpers/generate_random_id";
import { Plan } from "../../types_interfaces/types";



export class GetPlanUseCase {
    constructor() {
    };

    async all() {
        const d1Db = getD1Database(); 

        return d1Db.prepare(`SELECT * FROM plans`)
        .first();
    }
}