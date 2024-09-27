import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types/MyContext'

export const isManager: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { user } = context.req // Aquí se espera que el usuario esté en el contexto de la request

  // Debug: Mostrar el usuario y su rol en la consola
  console.log("User in middleware:", user)

  // Verificar si hay un usuario autenticado y si su rol es "manager"
  if (!user || user.role !== 'manager') {
    throw new Error('Not authorized as Manager') // Si no es manager, lanzamos un error
  }

  // Si el usuario es manager, continuar con la ejecución de la mutación
  return next()
}
