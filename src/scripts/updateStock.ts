import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';

async function updateStockForAllProducts() {
  try {
    await AppDataSource.initialize();

    const productRepository = AppDataSource.getRepository(Product);

    await productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ stock: 6 })
      .execute();

    console.log('Stock actualizado para todos los productos');
  } catch (error) {
    console.error('Error actualizando el stock:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

updateStockForAllProducts();
