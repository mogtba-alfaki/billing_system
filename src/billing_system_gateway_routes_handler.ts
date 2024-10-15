import { CustomerRoutesHandler } from "./customer/customer_routes_handler";

export class BillingSystemGatewayRoutesHandler {
    private customerRouteHandler: CustomerRoutesHandler;

    constructor() {
        this.customerRouteHandler = new CustomerRoutesHandler();
    }
    async handleRequest(request: Request, path: string): Promise<Response> {
        switch (path) {
            case 'customers':
                return this.customerRouteHandler.handelRoutes(request, [path]);
            case 'subscription_plans':
                return new Response('Subscription Plans', { status: 200 });
            case 'invoices':
                return new Response('Invoices', { status: 200 });
            case 'payments':
                return new Response('Payments', { status: 200 });
            default:
              return new Response('Not Found', { status: 404 });
          }
    }
}