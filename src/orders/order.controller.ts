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

@Controller("admin/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
  updateOrder(@Param("id") id: number, @Body() body: Partial<Order>) {
    return this.orderService.updateOrder(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Patch(":id/cancel")
  cancelOrder(@Param("id") id: number) {
    return this.orderService.cancelOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Patch(":id/activate")
  activateOrder(@Param("id") id: number) {
    return this.orderService.activateOrder(id);
  }

  @Get("details/:phone")
  getOrderDetailsByPhoneNumber(@Param("phone") phone: string) {
    return this.orderService.getOrderDetailsByPhoneNumber(phone);
  }
}
