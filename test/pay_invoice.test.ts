import { PayInvoiceUseCase } from '../src/payments/usecases/pay_invoice';
import { CustomerData } from '../src/customer/customer_data';
import { EmailService } from '../src/helpers/email_service';
import { generateUUID } from '../src/helpers/generate_random_id';
import { InvoicesData } from '../src/invoices/invoices_data';
import { PaymentGatewayIntegration } from '../src/payment_gateway_integration/payment_gateway_integration';
import { PaymentFailureReasons, PaymentIntegrationStatuses } from '../src/payment_gateway_integration/payment_gateway_integration_constants';
import { PaymentData } from '../src/payments/payments_data';

jest.mock('../src/customer/customer_data');
jest.mock('../src/helpers/email_service');
jest.mock('../src/helpers/generate_random_id');
jest.mock('../src/invoices/invoices_data');
jest.mock('../src/payment_gateway_integration/payment_gateway_integration');
jest.mock('../src/payments/payments_data');

describe('PayInvoiceUseCase', () => {
    let payInvoiceUseCase: PayInvoiceUseCase;

    beforeEach(() => {
        payInvoiceUseCase = new PayInvoiceUseCase();
    });

    it('should throw an error if invoice is not found', async () => {
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue(null);

        await expect(payInvoiceUseCase.pay('invoice-id')).rejects.toThrow('Invoice not found');
    });

    it('should throw an error if invoice is already paid', async () => {
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ payment_status: 'paid' });

        await expect(payInvoiceUseCase.pay('invoice-id')).rejects.toThrow('Invoice already paid');
    });

    it('should create a payment and update invoice status if payment is successful', async () => {
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ id: 'invoice-id', amount: 100, payment_status: 'pending', customer_id: 'customer-id' });
        (PaymentGatewayIntegration.charge as jest.Mock).mockResolvedValue(PaymentIntegrationStatuses.SUCCESS);
        (generateUUID as jest.Mock).mockReturnValue('payment-id');
        (PaymentData.createPayment as jest.Mock).mockResolvedValue({ id: 'payment-id' });
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue({ email: 'customer@example.com' });

        const result = await payInvoiceUseCase.pay('invoice-id');

        expect(result).toEqual({ id: 'payment-id' });
        expect(InvoicesData.updateInvoiceStatus).toHaveBeenCalledWith('invoice-id', 'paid');
        expect(EmailService.sendPaymentSuccessEmail).toHaveBeenCalledWith('customer@example.com', 'invoice-id');
    });

    it('should create a failed payment and update invoice status if payment fails', async () => {
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ id: 'invoice-id', amount: 100, payment_status: 'pending', customer_id: 'customer-id' });
        (PaymentGatewayIntegration.charge as jest.Mock).mockResolvedValue(PaymentIntegrationStatuses.FAILURE);
        (generateUUID as jest.Mock).mockReturnValue('payment-id');
        (PaymentData.createPayment as jest.Mock).mockResolvedValue({ id: 'payment-id' });
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue({ email: 'customer@example.com' });

        const result = await payInvoiceUseCase.pay('invoice-id');

        expect(result).toEqual({ id: 'payment-id' });
        expect(InvoicesData.updateInvoiceStatus).toHaveBeenCalledWith('invoice-id', 'failed');
        expect(EmailService.sendPaymentFailedEmail).toHaveBeenCalledWith('customer@example.com', 'invoice-id');
    });

    it('should handle network failure during payment', async () => {
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ id: 'invoice-id', amount: 100, payment_status: 'pending', customer_id: 'customer-id' });
        (PaymentGatewayIntegration.charge as jest.Mock).mockRejectedValue(new Error('Network error'));
        (generateUUID as jest.Mock).mockReturnValue('payment-id');
        (PaymentData.createPayment as jest.Mock).mockResolvedValue({ id: 'payment-id' });
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue({ email: 'customer@example.com' });

        const result = await payInvoiceUseCase.pay('invoice-id');

        expect(result).toEqual({ id: 'payment-id' });
        expect(InvoicesData.updateInvoiceStatus).toHaveBeenCalledWith('invoice-id', 'failed');
        expect(EmailService.sendPaymentFailedEmail).toHaveBeenCalledWith('customer@example.com', 'invoice-id');
    });
});