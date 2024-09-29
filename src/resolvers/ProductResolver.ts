import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware  } from 'type-graphql'
import { Product } from '../entities/Product'
import { ProductLike } from '../entities/ProductLike'
import { Category } from '../entities/Category'
import { AppDataSource } from '../data-source'
import { isManager } from '../middlewares/isManager'
import { getRepository } from 'typeorm';
import { MyContext } from "../types/MyContext";



@Resolver()
export class ProductResolver {

  @Mutation(() => Product)
  @UseMiddleware(isManager)
  async createProduct(
    @Arg('name') name: string,
    @Arg('price') price: number,
    @Arg('description') description: string,
    @Arg('categoryId') categoryId: number
  ): Promise<Product> {
    const productRepository = AppDataSource.getRepository(Product)
    const categoryRepository = AppDataSource.getRepository(Category)

    const category = await categoryRepository.findOne({ where: { id: categoryId } })
    if (!category) {
      throw new Error('Category not found')
    }

    const product = productRepository.create({
      name,
      price,
      description,
      category,
    })

    await productRepository.save(product)

    return product
  }

  @Mutation(() => Product)
  @UseMiddleware(isManager)
  async disableProduct(
    @Arg('id', () => Int) id: number,
    @Arg('isActive', () => Boolean) isActive: boolean
  ): Promise<Product> {
    const productRepository = AppDataSource.getRepository(Product)

    const product = await productRepository.findOne({ where: { id } })
    if (!product) {
      throw new Error('Product not found')
    }

    product.isActive = isActive

    await productRepository.save(product)

    return product
  }

  @Mutation(() => Product)
  @UseMiddleware(isManager)
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('price', { nullable: true }) price?: number,
    @Arg('description', { nullable: true }) description?: string,
    @Arg('categoryId', { nullable: true }) categoryId?: number
  ): Promise<Product | null> {
    const productRepository = AppDataSource.getRepository(Product)
    const categoryRepository = AppDataSource.getRepository(Category)

    const product = await productRepository.findOne({ where: { id } })
    if (!product) {
      throw new Error('Product not found')
    }

    if (name) {
      product.name = name
    }

    if (price) {
      product.price = price
    }

    if (description) {
      product.description = description
    }

    if (categoryId) {
      const category = await categoryRepository.findOne({ where: { id: categoryId } })
      if (!category) {
        throw new Error('Category not found')
      }
      product.category = category
    }

    await productRepository.save(product)

    return product
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isManager)
  async deleteProduct(@Arg('id', () => Int) id: number): Promise<boolean> {
    const productRepository = AppDataSource.getRepository(Product)

    const product = await productRepository.findOne({ where: { id } })
    if (!product) {
      throw new Error('Product not found')
    }

    await productRepository.remove(product)

    return true
  }

  @Mutation(() => Boolean)
  async likeProduct(
    @Arg('productId') productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    if (!req.session?.userId) {
      throw new Error('User not authenticated');
    }
  
    const userId = req.session.userId;
  
    const like = await AppDataSource.getRepository(ProductLike).findOne({
      where: { userId, productId },
    });
  
    if (like) {
      await AppDataSource.getRepository(ProductLike).remove(like);
      return false;
    } else {
      const newLike = AppDataSource.getRepository(ProductLike).create({ userId, productId });
      await AppDataSource.getRepository(ProductLike).save(newLike);
      return true;
    }
  }

  @Query(() => [Product])
  async listProducts(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Product[]> {
    const offset = (page - 1) * limit;
    const productRepository = AppDataSource.getRepository(Product);

    const products = await productRepository.find({
      skip: offset,
      take: limit,
    });

    return products;
  }

  @Query(() => [Product])
  async searchProductsByCategory(
    @Arg('categoryName') categoryName: string
  ): Promise<Product[]> {
    const productRepository = AppDataSource.getRepository(Product)

    const products = await productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.category', 'category')
      .where('category.name = :categoryName', { categoryName })
      .getMany()

    return products
  }
  
  @Query(() => Product, { nullable: true })
  async getProductById(
    @Arg('id', () => Int) id: number
  ): Promise<Product | null> {
    const productRepository = AppDataSource.getRepository(Product);
    
    const product = await productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  
    if (!product) {
      throw new Error('Product not found');
    }
  
    return product;
  }  

  @Query(() => [Product])
  async getProducts(): Promise<Product[]> {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    return products;
  }

}
