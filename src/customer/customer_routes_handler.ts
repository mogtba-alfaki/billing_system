import { Customer } from "../types/types";
import { CreateCustomerUseCase } from "./usecases/create_customer_usecase";
import { GetCustomerUseCase } from "./usecases/get_customer_usecase";

export class CustomerRoutesHandler {
  private createCustomerUseCase: CreateCustomerUseCase;
  private getCustomerUseCase: GetCustomerUseCase;
  constructor() {
    this.createCustomerUseCase = new CreateCustomerUseCase();
    this.getCustomerUseCase = new GetCustomerUseCase();
  };

  async handelRoutes(request: Request, path: string): Promise<Response> {
    if (request.method === 'GET') {
      const id = (path.split('/').pop()) ?? '';
      if(path.indexOf('invoices') != -1) {
        const invoices = await this.getCustomerUseCase.allCustomerInvoices(id);
        return new Response(JSON.stringify(invoices), { status: 200 });
      }
      const customer = await this.getCustomerUseCase.byId(id);
      return new Response(JSON.stringify(customer), { status: 200 });
    } else if (request.method === 'POST') {
      const customerData = (await request.json()) as Customer;
      const customer = await this.createCustomerUseCase.create(customerData);
      return new Response(JSON.stringify(customer), { status: 201 });
    }
    return new Response('Method Not Allowed', { status: 405 });
  }
}