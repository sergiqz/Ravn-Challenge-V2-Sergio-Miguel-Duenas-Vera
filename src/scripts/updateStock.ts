// updateStock.js
import { AppDataSource } from '../data-source'; // Asegúrate de usar la ruta correcta
import { Product } from '../entities/Product';

async function updateStockForAllProducts() {
  try {
    // Inicializar la conexión con la base de datos
    await AppDataSource.initialize();

    const productRepository = AppDataSource.getRepository(Product);

    // Ejecutar la actualización de stock para todos los productos
    await productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ stock: 6 }) // Establecer el stock a 6
      .execute();

    console.log('Stock actualizado para todos los productos');
  } catch (error) {
    console.error('Error actualizando el stock:', error);
  } finally {
    // Cerrar la conexión con la base de datos
    await AppDataSource.destroy();
  }
}

// Ejecutar la función
updateStockForAllProducts();
