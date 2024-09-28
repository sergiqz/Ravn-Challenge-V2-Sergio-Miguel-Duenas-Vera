import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Product } from './entities/Product';
import { Category } from './entities/Category';
import { Order } from './entities/Order';
import { Cart } from './entities/Cart';
import { ProductLike } from './entities/ProductLike';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sergio1997',
  database: 'snack_shop',
  synchronize: true,
  logging: true,
  entities: [User, Product, Category, Order, Cart, ProductLike],
});
