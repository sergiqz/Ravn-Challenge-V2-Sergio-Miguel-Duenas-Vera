import { Resolver, Query, UseMiddleware } from 'type-graphql';
import { Order } from '../entities/Order';
import { AppDataSource } from '../data-source';
import { isManager } from '../middlewares/isManager';

@Resolver()
export class OrderResolver {

  @Query(() => [Order])
  @UseMiddleware(isManager)
  async showClientOrders(): Promise<Order[]> {
    const orderRepository = AppDataSource.getRepository(Order);
    
    const orders = await orderRepository.find({
      relations: ['client', 'products']
    });

    return orders;
  }
}
