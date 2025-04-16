import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { sendWhatsAppMessage } from "./whatsapp.service";

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
    const orderId = this.generateOrderId();
    const saved = await this.orderRepo.save({ ...order, orderId });

    //sendWhatsAppMessage(order.phone!, `Hello ${order.name}, your order ${orderId} for ${order.quantity} dozen(s) has been placed successfully!\nDelivery Location: ${order.location}\nStatus: New Order`);

    return saved;
  }

  findAll() {
    return this.orderRepo.find({ order: { created_at: "DESC" } });
  }

  async updateOrder(id: number, updateFields: Partial<Order>) {
    await this.orderRepo.update(id, updateFields); // Update the order
    return this.orderRepo.findOne({ where: { id } }); // Fetch and return the updated order
  }

  async cancelOrder(id: number) {
    return this.orderRepo.update(id, { isActive: false });
  }

  async activateOrder(id: number) {
    return this.orderRepo.update(id, { isActive: true });
  }

  async getOrderDetailsByPhoneNumber(phone: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { phone, isActive: true },
      order: { created_at: "DESC" },
    });
  }
}
