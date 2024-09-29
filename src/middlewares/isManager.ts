import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types/MyContext'

export const isManager: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { user } = context

  console.log("User in middleware:", user)

  if (!user || user.role !== 'manager') {
    throw new Error('Not authorized as Manager')
  }

  return next()
}
