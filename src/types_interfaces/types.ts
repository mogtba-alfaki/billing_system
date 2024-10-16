


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


export interface AssignCustomerToPlan {
	customer_id: string;
	plan_id: string;
}