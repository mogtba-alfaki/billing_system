


export class GetCustomerUseCase{ 

    async byId(id: string): Promise<Response> {
        const data = await BILLING_KV.get(`customer:${id}`);
        if (data) {
          return new Response(data, { headers: { 'Content-Type': 'application/json' } });
        }
        return new Response('Customer Not Found', { status: 404 });
    }
}