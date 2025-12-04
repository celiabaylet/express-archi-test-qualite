import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('simple-array')
    public productIds: number[];

    @Column({ type: 'float' })
    public totalPrice: number;

    @CreateDateColumn()
    public createdAt: Date;

    @Column({
        type: 'varchar',
        length: 50,
        default: OrderStatus.PENDING
    })
    public status: OrderStatus;

    constructor({
        productIds,
        totalPrice
    }: {
        productIds: number[];
        totalPrice: number;
    }) {

        this.validateProductIds(productIds);
        this.validateTotalPrice(totalPrice);

        this.productIds = productIds;
        this.totalPrice = totalPrice;
        this.status = OrderStatus.PENDING;
        this.createdAt = new Date();
    } 

    private validateProductIds(productIds: number[]) {
        if (productIds.length < 1) {
            throw new Error("Une commande doit contenir au moins 1 produit");
        }

        if (productIds.length > 5) {
            throw new Error("Une commande ne peut contenir plus de 5 produits");
        }
    }

    private validateTotalPrice(totalPrice: number) {
        if (totalPrice < 2) {
            throw new Error("Le prix total doit être supérieur ou égal à 2€");
        }

        if (totalPrice > 500) {
            throw new Error("Le prix total doit être inférieur ou égal à 500€");
        }
    }
}
