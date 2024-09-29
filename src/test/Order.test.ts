import { OrderResolver } from '../resolvers/OrderResolver';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';

describe('OrderResolver - buyProducts', () => {
  let resolver: OrderResolver;

  beforeAll(async () => {
    resolver = new OrderResolver();
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should throw an error if client does not exist', async () => {
    await expect(
      resolver.buyProducts(999, [1, 2])
    ).rejects.toThrow('Client not found');
  });

  it('should throw an error if some products are not found', async () => {
    const client = new User();
    client.id = 1;
    jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(client);

    await expect(
      resolver.buyProducts(1, [999, 2])
    ).rejects.toThrow('Some products not found');
  });

  it('should throw an error if product is out of stock', async () => {
    const client = new User();
    client.id = 1;
    jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(client);
  
    const productInStock = new Product();
    productInStock.id = 1;
    productInStock.name = 'Product 2';
    productInStock.price = 100;
    productInStock.stock = 5;
    productInStock.description = 'This is a sample description';
  
    const productOutOfStock = new Product();
    productOutOfStock.id = 2;
    productOutOfStock.name = 'Product 1';
    productOutOfStock.price = 50;
    productOutOfStock.stock = 0;
    productOutOfStock.description = 'This product is out of stock';
  
    jest.spyOn(AppDataSource.getRepository(Product), 'findByIds').mockResolvedValue([productInStock, productOutOfStock]);
  
    await expect(
      resolver.buyProducts(1, [1, 2])
    ).rejects.toThrow('Product Product 1 is out of stock');
  });  

  it('should create an order when all products are available', async () => {
    const client = new User();
    client.id = 1;
    jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(client);
  
    const product = new Product();
    product.id = 1;
    product.name = 'Product 1';
    product.price = 100;
    product.stock = 10;
    product.description = 'This is a test product';
  
    jest.spyOn(AppDataSource.getRepository(Product), 'findByIds').mockResolvedValue([product]);
  
    const order = new Order();
    order.id = 1;
    jest.spyOn(AppDataSource.getRepository(Order), 'create').mockReturnValue(order);
    jest.spyOn(AppDataSource.getRepository(Order), 'save').mockResolvedValue(order);
  
    const result = await resolver.buyProducts(1, [1]);
  
    expect(result).toBeInstanceOf(Order);
  });
  
});

describe('OrderResolver - myOrders', () => {
    let resolver: OrderResolver;
  
    beforeAll(async () => {
      resolver = new OrderResolver();
      await AppDataSource.initialize();
    });
  
    afterAll(async () => {
      await AppDataSource.destroy();
    });
  
    it('should throw an error if user is not authenticated', async () => {
      const context = { req: { session: {} } };
  
      await expect(
        resolver.myOrders(context as any)
      ).rejects.toThrow('Not authenticated');
    });
  
    it('should return user orders', async () => {
      const context = { req: { session: { userId: 1 } } };
  
      const orders = [new Order(), new Order()];
      jest.spyOn(AppDataSource.getRepository(Order), 'find').mockResolvedValue(orders);
  
      const result = await resolver.myOrders(context as any);
  
      expect(result).toEqual(orders);
    });
  });

describe('OrderResolver - showClientOrders', () => {
    let resolver: OrderResolver;
  
    beforeAll(async () => {
      resolver = new OrderResolver();
      await AppDataSource.initialize();
    });
  
    afterAll(async () => {
      await AppDataSource.destroy();
    });
  
    it('should throw an error if client does not exist', async () => {
      jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(null);
  
      await expect(
        resolver.showClientOrders(999)
      ).rejects.toThrow('Client not found');
    });
  
    it('should return client orders if client exists', async () => {
      const client = new User();
      client.id = 1;
      jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValue(client);
  
      const orders = [new Order(), new Order()];
      jest.spyOn(AppDataSource.getRepository(Order), 'find').mockResolvedValue(orders);
  
      const result = await resolver.showClientOrders(1);
  
      expect(result).toEqual(orders);
    });
  });