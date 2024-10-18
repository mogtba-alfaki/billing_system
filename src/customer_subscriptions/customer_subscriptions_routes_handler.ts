import { AssignCustomerToPlan, CancelCustomerSubscriptionRequest, Plan } from "../types/types";
import { AssignCustomerToPlanUseCase } from "./usecases/assign_customer_to_plan";
import { CancelCustomerSubscription } from "./usecases/cancel_customer_subscription_usecase";
import { GetCustomerSubscriptionsUseCase } from "./usecases/get_customer_subscriptions_usecase";

export class CustomerSubscriptionRoutesHandler { 
    private readonly assignCustomerToPlanUseCase: AssignCustomerToPlanUseCase;
    private readonly getCustomerSubscriptions: GetCustomerSubscriptionsUseCase;
    private readonly cancelCustomerSubscriptions: CancelCustomerSubscription;

    constructor() {
        this.assignCustomerToPlanUseCase = new AssignCustomerToPlanUseCase();
        this.getCustomerSubscriptions = new GetCustomerSubscriptionsUseCase();
        this.cancelCustomerSubscriptions = new CancelCustomerSubscription();
    };

    async handelRoutes(request: Request, path: string): Promise<Response> {
      if (request.method === 'GET') {
            const id = (path.split('/').pop()) ?? null;
            if(id) {
                const subscription = await this.getCustomerSubscriptions.byCustomerId(id);
                return new Response(JSON.stringify(subscription), { status: 200 });
            }
            const allSubscriptions = await this.getCustomerSubscriptions.all();
            return new Response(JSON.stringify(allSubscriptions), { status: 200 });
        } else if (request.method === 'POST') {
            const subscriptionData = (await request.json()) as AssignCustomerToPlan;
            const subscription = await  this.assignCustomerToPlanUseCase.assign(subscriptionData);
            return new Response(JSON.stringify(subscription), { status: 201 });
        } else if(request.method == 'PUT') {
            const body = (await request.json()) as CancelCustomerSubscriptionRequest;
            if(!body.customer_id) {
                throw new Error("customer id is required");
            }
            const canceledInvoice = await  this.cancelCustomerSubscriptions.cancel(body.customer_id);
            return new Response(JSON.stringify(canceledInvoice), { status: 200 });
        }
        return new Response('Method Not Allowed', { status: 405 });
      }
}