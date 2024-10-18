import { GenerateSubscriptionInvoice } from '../src/invoices/usecases/generate_subscription_invoice';
import { CustomerSubscriptionData } from '../src/customer_subscriptions/customer_subscriptions_data';
import { InvoicesData } from '../src/invoices/invoices_data';
import { CustomerData } from '../src/customer/customer_data';
import { EmailService } from '../src/helpers/email_service';
import { generateUUID } from '../src/helpers/generate_random_id';

jest.mock('../src/customer_subscriptions/customer_subscriptions_data');
jest.mock('../src/invoices/invoices_data');
jest.mock('../src/customer/customer_data');
jest.mock('../src/helpers/email_service');
jest.mock('../src/helpers/generate_random_id');

describe('GenerateSubscriptionInvoice', () => {
    let generateSubscriptionInvoice: GenerateSubscriptionInvoice;

    beforeEach(() => {
        generateSubscriptionInvoice = new GenerateSubscriptionInvoice();
    });

    it('should throw an error if customer has no active subscriptions', async () => {
        (CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId as jest.Mock).mockResolvedValue(null);

        await expect(generateSubscriptionInvoice.generate('customer-id')).rejects.toThrow('Customer has no active subscriptions');
    });

    it('should throw an error if subscription is not active', async () => {
        (CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId as jest.Mock).mockResolvedValue({ status: 'inactive' });

        await expect(generateSubscriptionInvoice.generate('customer-id')).rejects.toThrow('Subscription is not active');
    });

    it('should throw an error if subscription is not ended yet', async () => {
        (CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId as jest.Mock).mockResolvedValue({ status: 'active', end_date: new Date(Date.now() + 10000).toISOString() });

        await expect(generateSubscriptionInvoice.generate('customer-id')).rejects.toThrow('Subscription is not ended yet, please cancel or change plan to generate mid invoice');
    });

    it('should throw an error if failed to create invoice', async () => {
        (CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId as jest.Mock).mockResolvedValue({ status: 'active', end_date: new Date(Date.now() - 10000).toISOString(), price: 100 });
        (InvoicesData.createInvoice as jest.Mock).mockResolvedValue(null);

        await expect(generateSubscriptionInvoice.generate('customer-id')).rejects.toThrow('Failed to create invoice');
    });

    it('should create an invoice and send an email if all conditions are met', async () => {
        (CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId as jest.Mock).mockResolvedValue({ status: 'active', end_date: new Date(Date.now() - 10000).toISOString(), price: 100 });
        (InvoicesData.createInvoice as jest.Mock).mockResolvedValue({ id: 'invoice-id' });
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue({ email: 'customer@example.com' });
        (generateUUID as jest.Mock).mockReturnValue('uuid');

        const result = await generateSubscriptionInvoice.generate('customer-id');

        expect(result).toEqual({ id: 'invoice-id' });
        expect(InvoicesData.createInvoice).toHaveBeenCalledWith(expect.objectContaining({
            id: 'uuid',
            customer_id: 'customer-id',
            amount: 100,
            payment_status: 'Pending',
        }));
        expect(EmailService.sendInvoiceGeneratedEmail).toHaveBeenCalledWith('customer@example.com', { id: 'invoice-id' });
    });
});