import { Invoice } from "../types/types";

// should be read from environment variables
const MAILGUN_API_KEY = 'your_mailgun_api_key';
const MAILGUN_DOMAIN = 'your_mailgun_domain';

export const sendEmail = async (to: string, subject: string, text: string) => {

	const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
	const auth = `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`;

	const formData = new URLSearchParams();
	formData.append('from', 'billing@billing.com');
	formData.append('to', to);
	formData.append('subject', subject);
	formData.append('text', text);
	formData.append('html', `<string>${text}</strong>`);

	try {
		console.log(` Sending Email To User , Email: ${to}, Subject: ${subject}, Text: ${text}`);
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': auth,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		});

		if (!response.ok) {
			throw new Error(`Failed to send email: ${response.statusText}`);
		}

		console.log('Email sent successfully');
	} catch (error) {
		console.error('Error sending email:', error);
	}
};


const sendInvoiceGeneratedEmail = async (email: string, invoice: Invoice) => {
	const message = `Invoice generated for your subscription, invoiceId: ${invoice.id}`;
	const subject = `
    Invoice generated for your subscription details : 
    invoiceId: ${invoice.id}
    amount : ${invoice.amount}
    due date : ${invoice.due_date}
    `;
	sendEmail(email, subject, message);
}

const sendPaymentSuccessEmail = async (email: string, invoiceId: string) => {
	const message = `Your payment for invoice ${invoiceId} was successful`;
	const subject = `Payment for invoice ${invoiceId} successful`;
	sendEmail(email, subject, message);
}

const sendPaymentFailedEmail = async (email: string, invoiceId: string) => {
	const message = `Your payment for invoice ${invoiceId} failed`;
	const subject = `Payment for invoice ${invoiceId} failed`;
	sendEmail(email, subject, message);
}


export const EmailService = {
	sendInvoiceGeneratedEmail,
	sendPaymentSuccessEmail,
	sendPaymentFailedEmail
}

