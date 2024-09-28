import { Arg, Int, Mutation, Resolver } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Cart } from '../entities/Cart';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

@Resolver()
export class CartResolver {

  @Mutation(() => Cart)
  async addToCart(
    @Arg('clientId', () => Int) clientId: number,  // ID del cliente
    @Arg('productIds', () => [Int]) productIds: number[]  // IDs de los productos
  ): Promise<Cart> {
    const cartRepository = AppDataSource.getRepository(Cart);
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

    // Verificar si el carrito ya existe
    let cart = await cartRepository.findOne({ where: { client }, relations: ['products'] });
    if (!cart) {
      // Si no existe, crear uno nuevo
      cart = cartRepository.create({
        client,
        products,
        totalQuantity: products.length,  // Asigna el total de productos
      });
    } else {
      // Si ya existe, agregar los productos al carrito y actualizar la cantidad total
      cart.products = [...cart.products, ...products];
      cart.totalQuantity += products.length;  // Incrementar la cantidad total
    }

    await cartRepository.save(cart);

    return cart;
  }
}

