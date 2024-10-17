import { getDataProvider } from "../..";
import { GenerateSubscriptionInvoice } from "../../invoices/usecases/generate_subscription_invoice";



export class GetCustomerUseCase{ 
  private readonly generate: GenerateSubscriptionInvoice;
  constructor() {
    this.generate = new GenerateSubscriptionInvoice();
  }
    async byId(id: string): Promise<Response> {
        const dataProvider = getDataProvider();
        const data = await dataProvider.get(`customer:${id}`);

        await this.generate.generate(id)
        

        if (data) {
          return new Response(data, { headers: { 'Content-Type': 'application/json' } });
        }
        return new Response('Customer Not Found', { status: 404 });
    }
}