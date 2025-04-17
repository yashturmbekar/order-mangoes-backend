import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Customer } from "./customer.entity";

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
