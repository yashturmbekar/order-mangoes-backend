import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { Order } from "./order.entity";
import { JwtAuthGuard } from "./jwt.guard";
import { Roles } from "./auth.controller";
import { AuthService } from "./auth.service";

@Controller("admin/orders")
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly authService: AuthService
  ) {}

  @Post()
  create(@Body() order: Partial<Order>) {
    return this.orderService.create(order);
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Patch(":id")
  updateOrder(@Param("id") id: string, @Body() body: Partial<Order>) {
    return this.orderService.updateOrder(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Patch(":id/cancel")
  cancelOrder(@Param("id") id: string) {
    return this.orderService.cancelOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Patch(":id/activate")
  activateOrder(@Param("id") id: string) {
    return this.orderService.activateOrder(id);
  }

  @Get("details/:phone")
  async getOrderDetailsByPhoneNumber(@Param("phone") phone: string) {
    const tokens = await this.authService.loginWithPhoneNumber(phone);
    const orderDetails = await this.orderService.getOrderDetailsByPhoneNumber(phone);

    return {
      orderDetails,
      ...tokens,
    };
  }

  @Get("statistics")
  async getOrderStatistics() {
    return this.orderService.getOrderStatistics();
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Get("delivery-statistics")
  async getDeliveryStatistics() {
    return this.orderService.getDeliveryStatistics();
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Get("grouped-delivery-orders")
  async getGroupedDeliveryOrders() {
    return this.orderService.getGroupedDeliveryOrders();
  }
}
