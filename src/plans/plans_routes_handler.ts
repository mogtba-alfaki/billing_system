import { Plan } from "../types_interfaces/types";
import { CreatePlanUseCase } from "./usecases/create_plan_usecase";
import { GetPlanUseCase } from "./usecases/get_plans_usecase";

export class PlansRoutesHandler { 
    private readonly createPlanUseCase: CreatePlanUseCase;
    private readonly getPlanUseCase: GetPlanUseCase;
    constructor() {
        this.createPlanUseCase = new CreatePlanUseCase();
        this.getPlanUseCase = new GetPlanUseCase();
    };

    async handelRoutes(request: Request, path: string): Promise<Response> {
      if (request.method === 'GET') {
            const id = (path.split('/').pop()) ?? '';
            const plans = await this.getPlanUseCase.all();
            return new Response(JSON.stringify(plans), { status: 200 });
        } else if (request.method === 'POST') {
            const planData = (await request.json()) as Plan;
            const plan = await this.createPlanUseCase.createPlan(planData);
            return new Response(JSON.stringify(plan), { status: 201 });
        }
        return new Response('Method Not Allowed', { status: 405 });
      }
}