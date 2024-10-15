


export interface SubscriptionPlan {
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
