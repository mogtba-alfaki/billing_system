import { getDataProvider } from "../..";



export class GetCustomerUseCase{ 

    async byId(id: string): Promise<Response> {
        const dataProvider = getDataProvider();
        const data = await dataProvider.get(`customer:${id}`);
        console.log(await dataProvider.list());
        if (data) {
          return new Response(data, { headers: { 'Content-Type': 'application/json' } });
        }
        return new Response('Customer Not Found', { status: 404 });
    }
}