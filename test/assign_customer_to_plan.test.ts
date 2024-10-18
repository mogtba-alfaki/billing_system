import { AssignCustomerToPlanUseCase } from '../src/customer_subscriptions/usecases/assign_customer_to_plan';
import { CustomerData } from '../src/customer/customer_data';
import { PlansData } from '../src/plans/plans_data';
import { CustomerSubscriptionData } from '../src/customer_subscriptions/customer_subscriptions_data';
import { generateUUID } from '../src/helpers/generate_random_id';

jest.mock('../src/customer/customer_data');
jest.mock('../src/plans/plans_data');
jest.mock('../src/customer_subscriptions/customer_subscriptions_data');
jest.mock('../src/helpers/generate_random_id');

describe('AssignCustomerToPlanUseCase', () => {
    let useCase: AssignCustomerToPlanUseCase;

    beforeEach(() => {
        useCase = new AssignCustomerToPlanUseCase();
    });

    it('should throw an error if customer is not found', async () => {
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue(null);

        await expect(useCase.assign({ customer_id: '1', plan_id: '1' })).rejects.toThrow('Customer not found');
    });

    it('should throw an error if plan is not found', async () => {
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue({ id: '1' });
        (PlansData.getPlanById as jest.Mock).mockResolvedValue(null);

        await expect(useCase.assign({ customer_id: '1', plan_id: '1' })).rejects.toThrow('Plan not found');
    });

    it('should throw an error if customer already has an active subscription', async () => {
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue({ id: '1' });
        (PlansData.getPlanById as jest.Mock).mockResolvedValue({ id: '1', billing_cycle: 'monthly' });
        (CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId as jest.Mock).mockResolvedValue({ id: '1' });

        await expect(useCase.assign({ customer_id: '1', plan_id: '1' })).rejects.toThrow('Customer already has an active subscription Please upgrade or cancel the current subscription');
    });

    it('should create a new subscription if all conditions are met', async () => {
        (CustomerData.getCustomerById as jest.Mock).mockResolvedValue({ id: '1' });
        (PlansData.getPlanById as jest.Mock).mockResolvedValue({ id: '1', billing_cycle: 'monthly', price: 10, name: 'Basic Plan' });
        (CustomerSubscriptionData.getActiveCustomerSubscriptionByCustomerId as jest.Mock).mockResolvedValue(null);
        (generateUUID as jest.Mock).mockReturnValue('new-uuid');
        (CustomerSubscriptionData.createCustomerSubscription as jest.Mock).mockResolvedValue({ id: 'new-uuid' });

        const result = await useCase.assign({ customer_id: '1', plan_id: '1' });

        expect(result).toEqual({ id: 'new-uuid' });
        expect(CustomerSubscriptionData.createCustomerSubscription).toHaveBeenCalledWith(expect.objectContaining({
            id: 'new-uuid',
            customer_id: '1',
            plan_id: '1',
            billing_cycle: 'monthly',
            price: 10,
            name: 'Basic Plan',
            status: 'active',
        }));
    });
});