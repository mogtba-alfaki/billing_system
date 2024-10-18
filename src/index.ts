import { BillingSystemGatewayRoutesHandler } from "./billing_system_gateway_routes_handler";
import {KVNamespace} from "@cloudflare/workers-types"; 

export interface  Env  {
	BILLING_KV: null,
  DB: D1Database,
}

let globalDataProvider: KVNamespace;
let billingDb: D1Database;
export default {
  async fetch(request: Request<unknown, CfProperties<unknown>>, environment: any, context: any) {
    const url = new URL(request.url);
    const path = url.pathname;
   
    globalDataProvider  = environment.BILLING_KV;
    billingDb = environment.DB;
    const App: BillingSystemGatewayRoutesHandler = new BillingSystemGatewayRoutesHandler();
    const response = App.handleRequest(request, path);
    return response;
  },

  async scheduled(controller: any, environment: Env, context: any) {
    const currentMinutes = new Date(controller.scheduledTime).getUTCMinutes();
    if (currentMinutes === 0) {
      console.log("Generating invoices...");
    } else if (currentMinutes === 30) {
      console.log("Retrying failed payments...");
    }
  }
}


export function getDataProvider() {
  return globalDataProvider;
}

export function getD1Database() {
  return billingDb;
}
