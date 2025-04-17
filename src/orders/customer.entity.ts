import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  phone!: string;

  @Column()
  name!: string;

  @Column({ type: "varchar", nullable: true })
  otp: string | null = null;

  @Column({ type: "timestamp", nullable: true })
  otpExpiry: Date | null = null;

  @OneToMany(() => Order, (order) => order.customer)
  orders!: Order[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
