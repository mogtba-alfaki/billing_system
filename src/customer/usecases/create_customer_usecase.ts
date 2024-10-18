import { CustomerData } from "../customer_data";
import { Customer } from "../../types_interfaces/types";

export class CreateCustomerUseCase {
    private readonly CustomerDataTag: string = 'customer:';

    async create(customerData: Customer) {        
        const createdCustomer = CustomerData.createCustomer(customerData);
         return createdCustomer;
    }
}

