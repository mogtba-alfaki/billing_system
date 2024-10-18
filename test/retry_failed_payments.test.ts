import { RetryFailedPayment } from '../src/payments/usecases/retry_failed_payment';
import { PaymentData } from '../src/payments/payments_data';
import { InvoicesData } from '../src/invoices/invoices_data';
import { PaymentGatewayIntegration } from '../src/payment_gateway_integration/payment_gateway_integration';
import { PaymentFailureReasons, PaymentIntegrationStatuses } from '../src/payment_gateway_integration/payment_gateway_integration_constants';
import { generateUUID } from '../src/helpers/generate_random_id';

jest.mock('../src/payments/payments_data');
jest.mock('../src/invoices/invoices_data');
jest.mock('../src/payment_gateway_integration/payment_gateway_integration');
jest.mock('../src/helpers/generate_random_id');

describe('RetryFailedPayment', () => {
    let retryFailedPayment: RetryFailedPayment;

    beforeEach(() => {
        retryFailedPayment = new RetryFailedPayment();
    });

    it('should throw an error if payment is not found', async () => {
        (PaymentData.getPaymentById as jest.Mock).mockResolvedValue(null);

        await expect(retryFailedPayment.retry('payment-id')).rejects.toThrow('Payment not found');
    });

    it('should throw an error if invoice is not found', async () => {
        (PaymentData.getPaymentById as jest.Mock).mockResolvedValue({ invoice_id: 'invoice-id' });
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue(null);

        await expect(retryFailedPayment.retry('payment-id')).rejects.toThrow('Invoice not found');
    });

    it('should throw an error if invoice is already paid', async () => {
        (PaymentData.getPaymentById as jest.Mock).mockResolvedValue({ invoice_id: 'invoice-id' });
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ payment_status: 'paid' });

        await expect(retryFailedPayment.retry('payment-id')).rejects.toThrow('Invoice already paid');
    });

    it('should create a new payment and update invoice status if payment is successful', async () => {
        (PaymentData.getPaymentById as jest.Mock).mockResolvedValue({ invoice_id: 'invoice-id', amount: 100 });
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ id: 'invoice-id', amount: 100, payment_status: 'pending' });
        (PaymentGatewayIntegration.charge as jest.Mock).mockResolvedValue(PaymentIntegrationStatuses.SUCCESS);
        (generateUUID as jest.Mock).mockReturnValue('new-payment-id');
        (PaymentData.createPayment as jest.Mock).mockResolvedValue({ id: 'new-payment-id' });

        const result = await retryFailedPayment.retry('payment-id');

        expect(result).toEqual({ id: 'new-payment-id' });
        expect(InvoicesData.updateInvoiceStatus).toHaveBeenCalledWith('invoice-id', 'paid');
        
        // clear mocks to avoid side effects of calling updateInvoiceStatus in the next test
        jest.clearAllMocks();
    });

    it('should return the existing failed payment if payment fails', async () => {
        (PaymentData.getPaymentById as jest.Mock).mockResolvedValue({ id: 'payment-id', invoice_id: 'invoice-id', amount: 100 });
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ id: 'invoice-id', amount: 100, payment_status: 'pending' });
        (PaymentGatewayIntegration.charge as jest.Mock).mockResolvedValue(PaymentIntegrationStatuses.FAILURE);

        const result = await retryFailedPayment.retry('payment-id');
        expect(result).toEqual({ id: 'payment-id', invoice_id: 'invoice-id', amount: 100 });
        expect(InvoicesData.updateInvoiceStatus).not.toHaveBeenCalled();

        jest.clearAllMocks();

    });

    it('should handle network failure during payment', async () => {
        (PaymentData.getPaymentById as jest.Mock).mockResolvedValue({ id: 'payment-id', invoice_id: 'invoice-id', amount: 100 });
        (InvoicesData.getInvoiceById as jest.Mock).mockResolvedValue({ id: 'invoice-id', amount: 100, payment_status: 'pending' });
        (PaymentGatewayIntegration.charge as jest.Mock).mockRejectedValue(new Error('Network error'));

        const result = await retryFailedPayment.retry('payment-id');

        expect(result).toEqual({ id: 'payment-id', invoice_id: 'invoice-id', amount: 100 });
        expect(InvoicesData.updateInvoiceStatus).not.toHaveBeenCalled();
        
        jest.clearAllMocks();
    });
});