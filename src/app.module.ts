import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ProductModule } from './product/product.module';
import { Product } from './entity/product.entity';
import { StoreModule } from './store/store.module';
import { Store } from './entity/store.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './entity/review.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './entity/catagory.entity';
import { CouponModule } from './coupon/coupon.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1943",
      database: "postgres",
      entities: [User,Product,Store,Review,Category],
      synchronize: true,
    }), 
    AuthModule, ProductModule, StoreModule, ReviewModule, CategoryModule, CouponModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
