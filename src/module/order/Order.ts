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


}