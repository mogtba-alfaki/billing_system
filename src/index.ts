import { BillingSystemGatewayRoutesHandler } from "./billing_system_gateway_routes_handler";
import {KVNamespace} from "@cloudflare/workers-types"; 
import { generateInvoicesCornHandler } from "./invoices/generate_invoices_corn_handler";
import { failedPaymentsCronHandler } from "./payments/failed_payments_cron_handler";

export interface  Env  {
	BILLING_KV: null,
  DB: D1Database,
}

let billingKvStore: KVNamespace;
let billingD1RelationalDb: D1Database;
export default {
  async fetch(request: Request<unknown, CfProperties<unknown>>, environment: any, context: any) {
    const url = new URL(request.url);
    const path = url.pathname;
   
    billingKvStore  = environment.BILLING_KV;
    billingD1RelationalDb = environment.DB;
    const App: BillingSystemGatewayRoutesHandler = new BillingSystemGatewayRoutesHandler();
    const response = App.handleRequest(request, path);
    return response;
  },

  async scheduled(controller: any, environment: Env, context: any) {
    const currentMinutes = new Date(controller.scheduledTime).getUTCMinutes();
    if (currentMinutes === 0) {
      console.log("Generating invoices Tic Started...");
      await generateInvoicesCornHandler();
    } else if (currentMinutes === 30) {
      console.log("Retrying failed payments Tic Started...");
      await failedPaymentsCronHandler();
    }
  }
}


export function getKvStore() {
  return billingKvStore;
}

export function getD1Database() {
  return billingD1RelationalDb;
}