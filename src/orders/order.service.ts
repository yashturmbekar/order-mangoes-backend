import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { sendWhatsAppMessage } from "./whatsapp.service";
import { Customer } from "./customer.entity";
import * as crypto from "crypto";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>
  ) {}

  generateOrderId(): string {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
    return `${Date.now()}${randomNumber}`;
  }

  async create(order: Partial<Order>) {
    // Check if customer exists
    let customer = await this.orderRepo.manager.findOne(Customer, {
      where: { phone: order.phone },
    });
    if (!customer) {
      customer = this.orderRepo.manager.create(Customer, {
        phone: order.phone,
        name: order.name,
      });
      await this.orderRepo.manager.save(customer);
    }

    const saved = await this.orderRepo.save({ ...order, customer });

    //sendWhatsAppMessage(order.phone!, `Hello ${order.name}, your order ${orderId} for ${order.quantity} dozen(s) has been placed successfully!\nDelivery Location: ${order.location}\nStatus: New Order`);

    return saved;
  }

  findAll() {
    return this.orderRepo.find({ order: { createdAt: "DESC" } });
  }

  async updateOrder(id: string, updateFields: Partial<Order>) {
    await this.orderRepo.update(id, updateFields); // Update the order
    return this.orderRepo.findOne({ where: { id } }); // Fetch and return the updated order
  }

  async cancelOrder(id: string) {
    return this.orderRepo.update(id, { isActive: false });
  }

  async activateOrder(id: string) {
    return this.orderRepo.update(id, { isActive: true });
  }

  async getOrderDetailsByPhoneNumber(phone: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { phone, isActive: true },
      order: { createdAt: "DESC" },
    });
  }
}
