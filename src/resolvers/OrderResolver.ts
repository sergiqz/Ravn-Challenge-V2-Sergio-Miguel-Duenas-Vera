import { Arg, Int, Mutation, Resolver } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

@Resolver()
export class OrderResolver {

  @Mutation(() => Order)
  async buyProducts(
    @Arg('clientId', () => Int) clientId: number, // El ID del cliente que realiza la compra
    @Arg('productIds', () => [Int]) productIds: number[] // Los IDs de los productos que desea comprar
  ): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);
    const userRepository = AppDataSource.getRepository(User);

    // Obtener el cliente
    const client = await userRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new Error('Client not found');
    }

    // Obtener los productos
    const products = await productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new Error('Some products not found');
    }

    // Verificar si hay suficiente stock para cada producto
    for (const product of products) {
      if (product.stock <= 0) {
        throw new Error(`Product ${product.name} is out of stock`);
      }
      // Aquí puedes reducir el stock si lo deseas
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
}
