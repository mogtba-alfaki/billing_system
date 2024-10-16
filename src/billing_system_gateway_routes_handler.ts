import { CustomerRoutesHandler } from "./customer/customer_routes_handler";
import { CustomerSubscriptionRoutesHandler } from "./customer_subscriptions/customer_subscriptions_routes_handler";
import { PlansRoutesHandler } from "./plans/plans_routes_handler";

export class BillingSystemGatewayRoutesHandler {
    private customerRouteHandler: CustomerRoutesHandler;
    private planRoutesHandler: PlansRoutesHandler;
    private customerSubscriptionRouterHandler: CustomerSubscriptionRoutesHandler;
    
    private apiV1Tag = '/api/v1';

    constructor() {
        this.customerRouteHandler = new CustomerRoutesHandler();
        this.planRoutesHandler = new PlansRoutesHandler();
        this.customerSubscriptionRouterHandler = new CustomerSubscriptionRoutesHandler();
    } 

    async handleRequest(request: Request, path: string): Promise<Response> {
        // do the same for the subscription_palans , invoices and payments routes 
        const customerRoutes = new RegExp(`^${this.apiV1Tag}/customers(/[\\w-]*)?$`);

        const subscriptionPlansRoutes = new RegExp(`^${this.apiV1Tag}/plans(/[\\w-]*)?$`);
        const customerSubscription = new RegExp(`^${this.apiV1Tag}/customer_subscriptions(/[\\w-]*)?$`);
        const invoicesRoutes = new RegExp(`^${this.apiV1Tag}/invoices(/[\\w-]*)?$`);
        const paymentsRoutes = new RegExp(`^${this.apiV1Tag}/payments(/[\\w-]*)?$`);

        switch (path) {
            case customerRoutes.test(path) ? path : '':
                return this.customerRouteHandler.handelRoutes(request, path);
            case subscriptionPlansRoutes.test(path) ? path : '':
                return this.planRoutesHandler.handelRoutes(request, path);
            case invoicesRoutes.test(path) ? path : '':
                return new Response('Invoices', { status: 200 });
            case paymentsRoutes.test(path) ? path : '':
                return new Response('Payments', { status: 200 });
            case customerSubscription.test(path) ? path : '':
                return this.customerSubscriptionRouterHandler.handelRoutes(request, path);
            default:

              return new Response('Not Found', { status: 404 });
          }
    }
}