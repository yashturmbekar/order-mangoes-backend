import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { JwtAuthGuard } from './jwt.guard';

@Controller('admin/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() order: Partial<Order>) {
    return this.orderService.create(order);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateOrder(@Param('id') id: number, @Body() body: Partial<Order>) {
  return this.orderService.updateOrder(id, body);
}

@UseGuards(JwtAuthGuard)
@Patch(':id/cancel')
cancelOrder(@Param('id') id: number) {
  return this.orderService.cancelOrder(id);
}

@UseGuards(JwtAuthGuard)
@Patch(':id/activate')
activateOrder(@Param('id') id: number) {
  return this.orderService.activateOrder(id);
}

  
}
