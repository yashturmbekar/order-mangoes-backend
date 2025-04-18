import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, DeliveryStatus, PaymentStatus } from "./order.entity";
import { sendWhatsAppMessage } from "./whatsapp.service";
import { Customer } from "./customer.entity";

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

  async getOrderStatistics(): Promise<{
    totalMangoesDelivered: number;
    totalOrdersReceived: number;
  }> {
    const totalMangoesDelivered = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.orderStatus = :status", { status: "delivered" })
      .select("SUM(order.quantity)", "total")
      .getRawOne();

    const totalOrdersReceived = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.orderStatus = :status", { status: "delivered" })
      .getCount();

    return {
      totalMangoesDelivered: totalMangoesDelivered?.total || 0,
      totalOrdersReceived,
    };
  }

  async getDeliveryStatistics() {
    const totalDozensDelivered = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.orderStatus = :status AND order.isActive = :isActive", {
        status: DeliveryStatus.DELIVERED,
        isActive: true,
      })
      .select("SUM(order.quantity)", "total")
      .getRawOne();

    const totalDozensOutForDelivery = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.orderStatus = :status AND order.isActive = :isActive", {
        status: DeliveryStatus.OUT_FOR_DELIVERY,
        isActive: true,
      })
      .select("SUM(order.quantity)", "total")
      .getRawOne();

    const totalDozensInProgress = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.orderStatus = :status AND order.isActive = :isActive", {
        status: DeliveryStatus.IN_PROGRESS,
        isActive: true,
      })
      .select("SUM(order.quantity)", "total")
      .getRawOne();

    const totalDozensOrderReceived = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.orderStatus = :status AND order.isActive = :isActive", {
        status: DeliveryStatus.ORDER_RECEIVED,
        isActive: true,
      })
      .select("SUM(order.quantity)", "total")
      .getRawOne();

    const totalPaymentsPending = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.paymentStatus = :status AND order.isActive = :isActive", {
        status: PaymentStatus.PENDING,
        isActive: true,
      })
      .getCount();

    const totalPaymentsCompleted = await this.orderRepo
      .createQueryBuilder("order")
      .where("order.paymentStatus = :status AND order.isActive = :isActive", {
        status: PaymentStatus.COMPLETED,
        isActive: true,
      })
      .getCount();

    const totalDeliveredWithPendingPayment = await this.orderRepo
      .createQueryBuilder("order")
      .where(
        "order.orderStatus = :orderStatus AND order.paymentStatus = :paymentStatus AND order.isActive = :isActive",
        {
          orderStatus: DeliveryStatus.DELIVERED,
          paymentStatus: PaymentStatus.PENDING,
          isActive: true,
        }
      )
      .getCount();

    const totalOrders = await this.orderRepo.count();

    return {
      totalDozensDelivered: totalDozensDelivered?.total || 0,
      totalDozensOutForDelivery: totalDozensOutForDelivery?.total || 0,
      totalDozensInProgress: totalDozensInProgress?.total || 0,
      totalDozensOrderReceived: totalDozensOrderReceived?.total || 0,
      totalPaymentsPending: totalPaymentsPending || 0,
      totalPaymentsCompleted: totalPaymentsCompleted || 0,
      totalDeliveredWithPendingPayment: totalDeliveredWithPendingPayment || 0,
      totalOrders, // Added total orders count
    };
  }

  async getGroupedDeliveryOrders() {
    const isActive = true;

    const deliveredOrders = await this.orderRepo.find({
      where: {
        orderStatus: DeliveryStatus.DELIVERED,
        isActive,
      },
      order: { createdAt: "DESC" },
    });

    const outForDeliveryOrders = await this.orderRepo.find({
      where: {
        orderStatus: DeliveryStatus.OUT_FOR_DELIVERY,
        isActive,
      },
      order: { createdAt: "DESC" },
    });

    const inProgressOrders = await this.orderRepo.find({
      where: {
        orderStatus: DeliveryStatus.IN_PROGRESS,
        isActive,
      },
      order: { createdAt: "DESC" },
    });

    const orderReceivedOrders = await this.orderRepo.find({
      where: {
        orderStatus: DeliveryStatus.ORDER_RECEIVED,
        isActive,
      },
      order: { createdAt: "DESC" },
    });

    const pendingDeliveryOrders = [
      ...outForDeliveryOrders,
      ...inProgressOrders,
      ...orderReceivedOrders,
    ];

    const paymentsPendingOrders = await this.orderRepo.find({
      where: {
        paymentStatus: PaymentStatus.PENDING,
        isActive,
      },
      order: { createdAt: "DESC" },
    });

    const paymentsCompletedOrders = await this.orderRepo.find({
      where: {
        paymentStatus: PaymentStatus.COMPLETED,
        isActive,
      },
      order: { createdAt: "DESC" },
    });

    const deliveredWithPendingPaymentOrders = await this.orderRepo.find({
      where: {
        orderStatus: DeliveryStatus.DELIVERED,
        paymentStatus: PaymentStatus.PENDING,
        isActive,
      },
      order: { createdAt: "DESC" },
    });

    const allOrders = await this.orderRepo.find({
      order: { createdAt: "DESC" },
    });

    return {
      deliveredOrders,
      pendingDeliveryOrders, // ✅ Combined list
      paymentsPendingOrders,
      paymentsCompletedOrders,
      deliveredWithPendingPaymentOrders,
      allOrders, // Added all orders
    };
  }
}
