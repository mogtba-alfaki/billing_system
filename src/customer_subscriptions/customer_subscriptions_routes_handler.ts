import { AssignCustomerToPlan, Plan } from "../types_interfaces/types";
import { AssignCustomerToPlanUseCase } from "./usecases/assign_customer_to_plan";
import { GetCustomerSubscriptionsUseCase } from "./usecases/get_customer_subscriptions_usecase";

export class CustomerSubscriptionRoutesHandler { 
    private readonly assignCustomerToPlanUseCase: AssignCustomerToPlanUseCase;
    private readonly getCustomerSubscriptions: GetCustomerSubscriptionsUseCase;
    constructor() {
        this.assignCustomerToPlanUseCase = new AssignCustomerToPlanUseCase();
        this.getCustomerSubscriptions = new GetCustomerSubscriptionsUseCase();
    };

    async handelRoutes(request: Request, path: string): Promise<Response> {
      if (request.method === 'GET') {
            const id = (path.split('/').pop()) ?? null;
            if(id) {
                const plan = await this.getCustomerSubscriptions.byCustomerId(id);
                return new Response(JSON.stringify(plan), { status: 200 });
            }
            const plans = await this.getCustomerSubscriptions.all();
            return new Response(JSON.stringify(plans), { status: 200 });
        } else if (request.method === 'POST') {
            const subscriptionData = (await request.json()) as AssignCustomerToPlan;
            return this.assignCustomerToPlanUseCase.assign(subscriptionData);

        }
        return new Response('Method Not Allowed', { status: 405 });
      }
}