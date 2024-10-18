import { getD1Database } from "..";
import { generateUUID } from "../helpers/generate_random_id";
import { Plan } from "../types_interfaces/types";




const createPlan = async (planData: Plan) => {
  const d1Db = getD1Database(); 

  const planId = generateUUID();
  await d1Db.prepare(`INSERT INTO plans (id, name, billing_cycle, price, status) VALUES (?, ?, ?, ?, ?)`)
  .bind(planId, planData.name, planData.billing_cycle, planData.price, planData.status)
  .first();
  return getPlanById(planId);
}


const getPlanById = async (planId: string) => {
  const d1Db = getD1Database();
  return d1Db.prepare('SELECT * FROM plans WHERE id = ?')
  .bind(planId)
  .first();
}


const getAllPlans = async () => {
  const d1Db = getD1Database();
  return d1Db.prepare('SELECT * FROM plans').first();
}

export const PlansData = {
  createPlan,
  getPlanById,
  getAllPlans,
}