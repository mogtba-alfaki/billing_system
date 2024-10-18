import { PayInvoiceUseCase } from "./usecases/pay_invoice";

export class PaymentsRoutesHandler { 
    private payInvoice: PayInvoiceUseCase;

    constructor() {
      this.payInvoice = new PayInvoiceUseCase();
    };

    async handelRoutes(request: Request, path: string): Promise<Response> {
      if (request.method === 'GET') {
        } else if (request.method === 'POST') {
          const invoiceId = (path.split('/').pop()) ?? '';
          const paymentResponse = await this.payInvoice.pay(invoiceId);
          return new Response(JSON.stringify(paymentResponse));
        }
        return new Response('Method Not Allowed', { status: 405 });
      }
}