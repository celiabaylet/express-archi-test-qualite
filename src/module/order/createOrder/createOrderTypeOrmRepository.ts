import AppDataSource from '../../../config/db.config';
import { Order } from "../Order";
import { CreateOrderRepository } from "./createOrderRepository";

export class CreateOrderTypeOrmRepository implements CreateOrderRepository {
    async save(order: Order): Promise<void> {
        const typeOrmRepository = AppDataSource.getRepository<Order>(Order);
        await typeOrmRepository.save(order);
    }
}
