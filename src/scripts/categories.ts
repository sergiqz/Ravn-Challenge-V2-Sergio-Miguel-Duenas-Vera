import 'reflect-metadata'
import { AppDataSource } from '../data-source'
import { Category } from '../entities/Category'

const categoriesData = [
  { name: 'Snacks' },
  { name: 'Bebidas' },
  { name: 'Dulces' },
  { name: 'Postres' },
  { name: 'Frutas' },
]

const createCategories = async () => {
  try {
    await AppDataSource.initialize()
    console.log('Conectado a la base de datos')

    const categoryRepository = AppDataSource.getRepository(Category)

    for (const category of categoriesData) {
      const newCategory = categoryRepository.create(category)
      await categoryRepository.save(newCategory)
      console.log(`Categoría creada: ${newCategory.name}`)
    }

    console.log('Categorías creadas con éxito')
    process.exit(0)
  } catch (error) {
    console.error('Error al crear las categorías:', error)
    process.exit(1)
  }
}

createCategories()
