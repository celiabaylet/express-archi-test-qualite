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

        // ---- VALIDATIONS ---- //

        if (productIds.length < 1) {
            throw new Error("Une commande doit contenir 1 produit au minimum");
        }

        if (productIds.length > 5) {
            throw new Error("Une commande ne peut contenir plus de 5 produits");
        }

        if (totalPrice < 2) {
            throw new Error("Le prix total doit être supérieur ou égal à 2€");
        }

        if (totalPrice > 500) {
            throw new Error("Le prix total doit être inférieur ou égal à 500€");
        }

        const order = new Order();
        order.productIds = productIds;
        order.totalPrice = totalPrice;
        order.status = OrderStatus.PENDING;
        order.createdAt = new Date();
        

        // ---- SAUVEGARDE ---- //
        try {
            await this.orderRepository.save(order);
        } catch (error) {
            throw new Error("Erreur lors de la création de la commande");
        }
    }
}
