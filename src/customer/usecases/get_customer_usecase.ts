import { InvoicesData } from "../../invoices/invoices_data";
import { Customer } from "../../types/types";
import { CustomerData } from "../customer_data";



export class GetCustomerUseCase{ 
  constructor() {
  }
    async byId(id: string): Promise<Customer | null> {
      return CustomerData.getCustomerById(id);        
    }

    async allCustomerInvoices(customerId: string) {
      const invoices = await InvoicesData.getAllCustomerInvoices(customerId);
      return invoices
    }
}