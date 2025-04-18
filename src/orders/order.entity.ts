import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Customer } from "./customer.entity";

export const DeliveryStatus = {
  ORDER_RECEIVED: "order_received",
  IN_PROGRESS: "in_progress",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
} as const;

export type DeliveryStatus =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

export const PaymentStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  quantity!: number;

  @Column()
  location!: string;

  @Column({ default: "New Order" })
  status!: string;

  @Column({ default: "pending" })
  paymentStatus!: string;

  @Column({ default: "order_received" })
  orderStatus!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastUpdatedAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: true,
    onDelete: "SET NULL",
  })
  customer!: Customer;
}
