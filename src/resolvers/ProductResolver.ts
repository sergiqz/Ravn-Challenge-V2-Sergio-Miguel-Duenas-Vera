import { Arg, Int, Query, Resolver } from 'type-graphql'
import { Product } from '../entities/Product'
import { AppDataSource } from '../data-source'

@Resolver()
export class ProductResolver {
  // List products with pagination
  @Query(() => [Product])
  async listProducts(
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Product[]> {
    const offset = (page - 1) * limit
    const productRepository = AppDataSource.getRepository(Product)

    const products = await productRepository.find({
      skip: offset,
      take: limit,
    })

    return products
  }

  // Search for products by category
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
}
