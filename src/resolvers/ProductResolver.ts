import { Arg, Int, Mutation, Query, Resolver, UseMiddleware  } from 'type-graphql'
import { Product } from '../entities/Product'
import { Category } from '../entities/Category'
import { AppDataSource } from '../data-source'
import { isManager } from '../middlewares/isManager'

@Resolver()
export class ProductResolver {

  @Mutation(() => Product)
  @UseMiddleware(isManager) // Solo los managers pueden crear productos
  async createProduct(
    @Arg('name') name: string,
    @Arg('price') price: number,
    @Arg('description') description: string,
    @Arg('categoryId') categoryId: number
  ): Promise<Product> {
    const productRepository = AppDataSource.getRepository(Product)
    const categoryRepository = AppDataSource.getRepository(Category)

    // Buscar la categoría asociada
    const category = await categoryRepository.findOne({ where: { id: categoryId } })
    if (!category) {
      throw new Error('Category not found')
    }

    // Crear el producto
    const product = productRepository.create({
      name,
      price,
      description,
      category,
    })

    // Guardar el producto en la base de datos
    await productRepository.save(product)

    return product
  }

  @Mutation(() => Product)
  @UseMiddleware(isManager) // Solo los managers pueden actualizar productos
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('price', { nullable: true }) price?: number,
    @Arg('description', { nullable: true }) description?: string,
    @Arg('categoryId', { nullable: true }) categoryId?: number
  ): Promise<Product | null> {
    const productRepository = AppDataSource.getRepository(Product)
    const categoryRepository = AppDataSource.getRepository(Category)

    // Buscar el producto por ID
    const product = await productRepository.findOne({ where: { id } })
    if (!product) {
      throw new Error('Product not found')
    }

    // Actualizar el nombre si se proporciona
    if (name) {
      product.name = name
    }

    // Actualizar el precio si se proporciona
    if (price) {
      product.price = price
    }

    // Actualizar la descripción si se proporciona
    if (description) {
      product.description = description
    }

    // Si se proporciona categoryId, actualizar la categoría del producto
    if (categoryId) {
      const category = await categoryRepository.findOne({ where: { id: categoryId } })
      if (!category) {
        throw new Error('Category not found')
      }
      product.category = category
    }

    // Guardar los cambios en la base de datos
    await productRepository.save(product)

    return product
  }

  // Mutación para eliminar un producto
  @Mutation(() => Boolean) // Devolveremos `true` si el producto se elimina con éxito
  @UseMiddleware(isManager) // Solo los managers pueden eliminar productos
  async deleteProduct(@Arg('id', () => Int) id: number): Promise<boolean> {
    const productRepository = AppDataSource.getRepository(Product)

    // Buscar el producto por ID
    const product = await productRepository.findOne({ where: { id } })
    if (!product) {
      throw new Error('Product not found') // Si no encuentra el producto, lanza error
    }

    // Eliminar el producto de la base de datos
    await productRepository.remove(product)

    return true // Devolvemos `true` indicando que la operación fue exitosa
  }

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
