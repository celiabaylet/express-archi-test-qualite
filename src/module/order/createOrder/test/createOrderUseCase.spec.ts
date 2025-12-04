import { describe, expect, test } from '@jest/globals';
import { CreateOrderUseCase } from '../createOrderUseCase';
import { CreateOrderRepository } from '../createOrderRepository';
import { Order } from '../../Order';

class CreateOrderDummyRepository implements CreateOrderRepository {
    async save(order: Order): Promise<void> {
        // dummy : ne fait rien
    }
}

class CreateOrderMockFailRepository implements CreateOrderRepository {
    async save(order: Order): Promise<void> {
        throw new Error('fail repo');
    }
}

describe('US-2 : Créer une commande', () => {

    test('Scénario : échec, plus de 5 produits', async () => {
        const createOrderRepository = new CreateOrderDummyRepository();
        const createOrderUseCase = new CreateOrderUseCase(createOrderRepository);

        await expect(
            createOrderUseCase.execute({
                productIds: [1, 2, 3, 4, 5, 6],
                totalPrice: 150
            })
        ).rejects.toThrow('Une commande ne peut contenir plus de 5 produits');
    });


});
