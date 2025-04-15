import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  orderId!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  quantity!: number;

  @Column()
  location!: string;

  @Column({ default: 'New Order' })
  status!: string;

  @Column({ default: 'pending' })
  paymentStatus!: string;

  @Column({ default: 'order_received' })
  orderStatus!: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn()
  lastUpdatedAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

}
