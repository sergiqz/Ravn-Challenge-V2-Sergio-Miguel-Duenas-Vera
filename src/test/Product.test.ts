import { ProductResolver } from '../resolvers/ProductResolver';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { Category } from '../entities/Category';
import { ProductLike } from '../entities/ProductLike';

describe('ProductResolver', () => {
  let resolver: ProductResolver;

  beforeAll(async () => {
    resolver = new ProductResolver();
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const category = new Category();
      category.id = 1;
      jest.spyOn(AppDataSource.getRepository(Category), 'findOne').mockResolvedValue(category);

      const product = new Product();
      product.id = 1;
      product.name = 'New Product';
      jest.spyOn(AppDataSource.getRepository(Product), 'create').mockReturnValue(product);
      jest.spyOn(AppDataSource.getRepository(Product), 'save').mockResolvedValue(product);

      const result = await resolver.createProduct('New Product', 100, 'Product Description', 1);

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe('New Product');
    });

    it('should throw an error if category is not found', async () => {
      jest.spyOn(AppDataSource.getRepository(Category), 'findOne').mockResolvedValue(null);

      await expect(
        resolver.createProduct('New Product', 100, 'Product Description', 999)
      ).rejects.toThrow('Category not found');
    });
  });

  describe('disableProduct', () => {
    it('should disable a product', async () => {
      const product = new Product();
      product.id = 1;
      product.isActive = true;
      jest.spyOn(AppDataSource.getRepository(Product), 'findOne').mockResolvedValue(product);
      jest.spyOn(AppDataSource.getRepository(Product), 'save').mockResolvedValue(product);

      const result = await resolver.disableProduct(1, false);

      expect(result).toBeInstanceOf(Product);
      expect(result.isActive).toBe(false);
    });

    it('should throw an error if product is not found', async () => {
      jest.spyOn(AppDataSource.getRepository(Product), 'findOne').mockResolvedValue(null);

      await expect(
        resolver.disableProduct(999, false)
      ).rejects.toThrow('Product not found');
    });
  });

  describe('updateProduct', () => {
    it('should update a product name and price', async () => {
      const product = new Product();
      product.id = 1;
      product.name = 'Old Name';
      product.price = 50;
      jest.spyOn(AppDataSource.getRepository(Product), 'findOne').mockResolvedValue(product);
      jest.spyOn(AppDataSource.getRepository(Product), 'save').mockResolvedValue(product);
  
      const result = await resolver.updateProduct(1, 'Updated Name', 200);
  
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Updated Name');
      expect(result!.price).toBe(200);
    });
  
    it('should throw an error if product is not found', async () => {
      jest.spyOn(AppDataSource.getRepository(Product), 'findOne').mockResolvedValue(null);
  
      await expect(
        resolver.updateProduct(999, 'New Name', 150)
      ).rejects.toThrow('Product not found');
    });
  });  

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const product = new Product();
      product.id = 1;
      jest.spyOn(AppDataSource.getRepository(Product), 'findOne').mockResolvedValue(product);
      jest.spyOn(AppDataSource.getRepository(Product), 'remove').mockResolvedValue(product);

      const result = await resolver.deleteProduct(1);

      expect(result).toBe(true);
    });

    it('should throw an error if product is not found', async () => {
      jest.spyOn(AppDataSource.getRepository(Product), 'findOne').mockResolvedValue(null);

      await expect(
        resolver.deleteProduct(999)
      ).rejects.toThrow('Product not found');
    });
  });

  describe('likeProduct', () => {
    it('should like a product for an authenticated user', async () => {
      const context = { req: { session: { userId: 1 } } };
      const productLike = new ProductLike();
      productLike.userId = 1;
      productLike.productId = 1;
      jest.spyOn(AppDataSource.getRepository(ProductLike), 'findOne').mockResolvedValue(null);
      jest.spyOn(AppDataSource.getRepository(ProductLike), 'create').mockReturnValue(productLike);
      jest.spyOn(AppDataSource.getRepository(ProductLike), 'save').mockResolvedValue(productLike);

      const result = await resolver.likeProduct(1, context as any);

      expect(result).toBe(true);
    });

    it('should throw an error if user is not authenticated', async () => {
      const context = { req: { session: {} } };

      await expect(
        resolver.likeProduct(1, context as any)
      ).rejects.toThrow('User not authenticated');
    });
  });
});
