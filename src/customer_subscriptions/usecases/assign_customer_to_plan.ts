import { CustomerData } from "../../customer/customer_data";
import { generateUUID } from "../../helpers/generate_random_id";
import { PlansData } from "../../plans/plans_data";
import { AssignCustomerToPlan, CustomerSubscription } from "../../types_interfaces/types";
import { CustomerSubscriptionData } from "../customer_subscriptions_data";



export class AssignCustomerToPlanUseCase {
	constructor() {
	};

	async assign(assignData: AssignCustomerToPlan) {

		const planFound = await PlansData.getPlanById(assignData.plan_id);
		const customerFound = await CustomerData.getCustomerById(assignData.customer_id);
		
		if (!customerFound) {
			throw new Error('Customer not found');
		}
		
		if (!planFound) {
			throw new Error('Plan not found');
		}
		
		const currentCustomerSubscription = await CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId(assignData.customer_id);
		if (currentCustomerSubscription) {
			throw new Error('Customer already has an active subscription Please upgrade or cancel the current subscription'); 
		}

		const planBillingCycle = planFound.billing_cycle as string;
		let subscriptionDates =  await this.calculateStartAndEndSubscriptionDates(planBillingCycle)


		let customerSubscriptionDto = {
			id: generateUUID(),
			customer_id: assignData.customer_id,
			plan_id: assignData.plan_id,
			billing_cycle: planBillingCycle,
			price: planFound.price,
			name: planFound.name,
			status: 'active',
			start_date: subscriptionDates.startDate,
			end_date: subscriptionDates.endDate,
		} as unknown as CustomerSubscription;

		const createdSubscription = await CustomerSubscriptionData.createCustomerSubscription(customerSubscriptionDto);

		return createdSubscription;
	}

	private async calculateStartAndEndSubscriptionDates(billingCycle: string) {
		let planEndDateInit = new Date();
		let planEndDate;
		if (billingCycle === 'monthly') {
			planEndDate = new Date(new Date().setMonth(planEndDateInit.getMonth() + 1)).toISOString();
		} else if (billingCycle === 'yearly') {
			planEndDate = new Date(planEndDateInit.setFullYear(planEndDateInit.getFullYear() + 1)).toISOString();
		}

		return {
			startDate: new Date(),
			endDate: planEndDate,
		};
	}
}