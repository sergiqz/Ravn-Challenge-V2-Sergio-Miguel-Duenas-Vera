import { Arg, Ctx, Int, Mutation, Resolver, Query, UseMiddleware } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import { MyContext } from "../types/MyContext";
import { isAuth } from '../middlewares/isAuthMiddleware'

@Resolver()
export class OrderResolver {

  @Mutation(() => Order)
  async buyProducts(
    @Arg('clientId', () => Int) clientId: number,
    @Arg('productIds', () => [Int]) productIds: number[]
  ): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);
    const userRepository = AppDataSource.getRepository(User);
    const client = await userRepository.findOne({ where: { id: clientId } });

    if (!client) {
      throw new Error('Client not found');
    }

    const products = await productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new Error('Some products not found');
    }

    for (const product of products) {
      if (product.stock <= 0) {
        throw new Error(`Product ${product.name} is out of stock`);
      }
      product.stock -= 1;
      await productRepository.save(product);
    }

    const order = orderRepository.create({
      client,
      products,
      orderDate: new Date(),
      status: 'COMPLETED',
    });

    await orderRepository.save(order);

    return order;
  }

  @Query(() => [Order])
  @UseMiddleware(isAuth)
  async myOrders(@Ctx() { req }: MyContext): Promise<Order[]> {
    const userId = req.session.userId;
  
    if (!userId) {
      throw new Error("Not authenticated");
    }
  
    const orderRepository = AppDataSource.getRepository(Order);
    const orders = await orderRepository.find({
      where: { client: { id: userId } },
      relations: ['client', 'products'],
    });
    
    return orders;
  }

}
