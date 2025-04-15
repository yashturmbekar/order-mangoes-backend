import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? {
            url: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          }
        : {
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'root',
            database: 'mango_orders',
          }),
      entities: [Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order]),
    JwtModule.register({
      secret: 'mangoSecretKey',
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [OrderController, AuthController],
  providers: [OrderService, AuthService, JwtStrategy],
})
export class AppModule {}
