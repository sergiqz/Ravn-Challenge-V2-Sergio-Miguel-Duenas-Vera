import { CartResolver } from '../resolvers/CartResolver';
import { AppDataSource } from '../data-source';
import { Cart } from '../entities/Cart';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

describe('CartResolver', () => {
  let resolver: CartResolver;

  beforeAll(async () => {
    resolver = new CartResolver();
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('addToCart', () => {
    it('should add products to an existing cart', async () => {
      const client = new User();
      client.id = 1;
      jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(client);

      const existingProduct = new Product();
      existingProduct.id = 1;
      existingProduct.name = 'Existing Product';
      existingProduct.price = 50;

      const newProduct = new Product();
      newProduct.id = 2;
      newProduct.name = 'New Product';
      newProduct.price = 150;

      jest.spyOn(AppDataSource.getRepository(Product), 'findByIds').mockResolvedValue([newProduct]);

      const cart = new Cart();
      cart.id = 1;
      cart.client = client;
      cart.products = [existingProduct];
      cart.totalQuantity = 1;
      jest.spyOn(AppDataSource.getRepository(Cart), 'findOne').mockResolvedValue(cart);

      jest.spyOn(AppDataSource.getRepository(Cart), 'save').mockResolvedValue({
        ...cart,
        products: [...cart.products, newProduct],
        totalQuantity: 2,
      });

      const result = await resolver.addToCart(1, [2]);

      expect(result).toBeInstanceOf(Cart);
      expect(result.client).toEqual(client);
      expect(result.products.length).toBe(2);
      expect(result.totalQuantity).toBe(2);
    });

    it('should throw an error if client is not found', async () => {
      jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(null);

      await expect(resolver.addToCart(999, [1, 2])).rejects.toThrow('Client not found');
    });

    it('should throw an error if some products are not found', async () => {
      const client = new User();
      client.id = 1;
      jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(client);

      const product = new Product();
      product.id = 1;
      product.name = 'Product 1';
      jest.spyOn(AppDataSource.getRepository(Product), 'findByIds').mockResolvedValue([product]);

      await expect(resolver.addToCart(1, [1, 2])).rejects.toThrow('Some products not found');
    });
  });
});
