import { getDataProvider } from "../..";
import { Customer } from "../../types/types";
import { CustomerData } from "../customer_data";



export class GetCustomerUseCase{ 
  constructor() {
  }
    async byId(id: string): Promise<Customer | null> {
      return CustomerData.getCustomerById(id);        
    }
}