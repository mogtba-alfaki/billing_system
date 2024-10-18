import { GetCustomerUseCase } from "../customer/usecases/get_customer_usecase";

export class InvoicesRoutesHandler {
  private getCustomerUseCase: GetCustomerUseCase;
  constructor() {
    this.getCustomerUseCase = new GetCustomerUseCase();
  };

  async handelRoutes(request: Request, path: string): Promise<Response> {
    if (request.method === 'GET') {
      const customerId = (path.split('/').pop()) ?? '';
      const invoices = await this.getCustomerUseCase.allCustomerInvoices(customerId);
      return new Response(JSON.stringify(invoices), { status: 200 });
    }
    return new Response('Method Not Allowed', { status: 405 });
  }
}