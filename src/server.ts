import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { AppDataSource } from './data-source'
import { ProductResolver } from './resolvers/ProductResolver'
import authRouter from './routes/auth'
import jwt from 'jsonwebtoken'
import { MyContext } from './types/MyContext'
import { OrderResolver } from './resolvers/OrderResolver';
import { CartResolver } from './resolvers/CartResolver';
import productsRouter from './routes/products';

const app = express()
app.use(express.json())
app.use('/api/products', productsRouter);
app.use('/auth', authRouter)
app.use('/uploads', express.static('uploads'));
app.use('/api', productsRouter);

const PORT = process.env.PORT || 4000

AppDataSource.initialize()
  .then(async () => {
    const schema = await buildSchema({
      resolvers: [ProductResolver, OrderResolver, CartResolver],
    })

    const server = new ApolloServer({
      schema,
      context: ({ req, res }): MyContext => {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.split(' ')[1]
    
        if (token) {
          try {
            const decoded = jwt.verify(token, 'token_secret') as any
            console.log('Decoded JWT:', decoded)
            req.user = decoded
            return { req, res, user: decoded }
          } catch (err) {
            console.error('Invalid token', err)
          }
        }
    
        return { req, res, user: null }
      },
    })
    
    await server.start()
    server.applyMiddleware({ app, path: '/graphql' })

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`)
    })
  })
  .catch((error) => console.log('Error al conectar a la base de datos', error))

export default app;
