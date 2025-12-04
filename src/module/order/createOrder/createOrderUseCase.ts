import { Order, OrderStatus } from "../Order";
import { CreateOrderRepository } from "./createOrderRepository";

export class CreateOrderUseCase {
    private orderRepository: CreateOrderRepository;

    constructor(orderRepository: CreateOrderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute({
        productIds,
        totalPrice
    }: {
        productIds: number[];
        totalPrice: number;
    }): Promise<void> {

        const order = new Order({productIds, totalPrice});

        // ---- SAUVEGARDE ---- //
        try {
            await this.orderRepository.save(order);
        } catch (error) {
            throw new Error("erreur lors de la création de la commande");
        }
    }
}
