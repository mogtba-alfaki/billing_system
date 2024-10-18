

/* system entities */

export interface Customer {
	id: string;
	name: string;
	email: string;
	subscription_plan_id: string;
	subscription_status: string;
}

export interface Plan {
	id: string;
	name: string;
	billing_cycle: 'monthly' | 'yearly';
	price: number;
	status: 'active' | 'inactive';
}

export interface Invoice {
	id: string;
	customer_id: string;
	amount: number;
	due_date: string;
	payment_status: 'pending' | 'paid' | 'failed';
	payment_date?: string;
}

export interface Payment {
	id: string;
	invoice_id: string;
	amount: number;
	payment_method: 'credit_card' | 'paypal';
	payment_date: string;
	payment_status: 'paid' | 'failed';
}

export interface CustomerSubscription {
	id: string;
	customer_id: string;
	plan_id: string;
	billing_cycle: 'monthly' | 'yearly';
	price: number;
	name: string;
	status: 'active' | 'inactive';
	start_date: string;
	end_date: string;
}


/* dto's (data transfer objects) */

export interface AssignCustomerToPlan {
	customer_id: string;
	plan_id: string;
}

export interface PaymentGatewayIntegrationChargePayment {
	amount: number,
	cardNumber: string,
	cardExpMonth: string,
	cardExpYear: string,
	cardCVC: string
}


export interface CancelCustomerSubscriptionRequest {
	customer_id: string;
}