import { Arg, Int, Mutation, Resolver } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Cart } from '../entities/Cart';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

@Resolver()
export class CartResolver {

  @Mutation(() => Cart)
  async addToCart(
    @Arg('clientId', () => Int) clientId: number,
    @Arg('productIds', () => [Int]) productIds: number[]
  ): Promise<Cart> {
    const cartRepository = AppDataSource.getRepository(Cart);
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

    let cart = await cartRepository.findOne({ where: { client }, relations: ['products'] });
    if (!cart) {
      cart = cartRepository.create({
        client,
        products,
        totalQuantity: products.length,
      });
    } else {
      cart.products = [...cart.products, ...products];
      cart.totalQuantity += products.length;
    }

    await cartRepository.save(cart);

    return cart;
  }
}
