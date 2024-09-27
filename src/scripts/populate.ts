import { Product } from '../entities/Product'
import { AppDataSource } from '../data-source'

AppDataSource.initialize()
  .then(async () => {
    const productRepository = AppDataSource.getRepository(Product)

    const products = [
      { name: 'Chips', price: 1.99, description: 'Crispy potato chips'},
      { name: 'Soda', price: 0.99, description: 'Refreshing beverage'},
      { name: 'Chocolate Bar', price: 2.5, description: 'Delicious chocolate bar'},
      { name: 'Candy', price: 0.5, description: 'Sweet candy treats'},
    ]

    for (const product of products) {
      await productRepository.save(product)
    }

    console.log('Script executed: Products were inserted into the database')
  })
  .catch((error) => console.log(error))
  .finally(() => process.exit())
