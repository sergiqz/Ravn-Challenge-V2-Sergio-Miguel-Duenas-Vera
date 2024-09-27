import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { AppDataSource } from './data-source'
import { ProductResolver } from './resolvers/ProductResolver'
import authRouter from './routes/auth'
import jwt from 'jsonwebtoken'
import { MyContext } from './types/MyContext'

const app = express()

app.use(express.json())

// Montar el router de autenticación en Express
app.use('/auth', authRouter)

// Puerto de la aplicación
const PORT = process.env.PORT || 4000

AppDataSource.initialize()
  .then(async () => {
    const schema = await buildSchema({
      resolvers: [ProductResolver],
    })

    const server = new ApolloServer({
      schema,
      context: ({ req, res }): MyContext => {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.split(' ')[1]
    
        if (token) {
          try {
            // Verificar el token y obtener los datos del usuario
            const decoded = jwt.verify(token, 'token_secret') as any
            console.log('Decoded JWT:', decoded) // <-- Depuración para ver el token decodificado
            req.user = decoded // Asignar el usuario decodificado al request
            return { req, res, user: decoded }
          } catch (err) {
            console.error('Invalid token', err)
          }
        }
    
        // Si no hay token o es inválido, el usuario será null
        return { req, res, user: null }
      },
    })
    
    await server.start()
    server.applyMiddleware({ app, path: '/graphql' })

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`)
    })
  })
  .catch((error) => console.log('Error al conectar a la base de datos', error))
