import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { AppDataSource } from './data-source'
import { ProductResolver } from './resolvers/ProductResolver'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 4000

AppDataSource.initialize()
  .then(async () => {
    console.log('Conectado a la base de datos')

    const schema = await buildSchema({
      resolvers: [ProductResolver],
    })

    const server = new ApolloServer({
      schema,
    })

    await server.start()
    server.applyMiddleware({ app, path: '/graphql' })

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`)
    })
  })
  .catch((error) => console.log('Error al conectar a la base de datos', error))
