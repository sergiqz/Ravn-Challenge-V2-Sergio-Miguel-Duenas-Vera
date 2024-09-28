import { Router, Request, Response } from 'express'
import { User, UserRole } from '../entities/User'
import { verifyRole } from '../middlewares/roleMiddleware'
import { AppDataSource } from '../data-source'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const authRouter = Router()

authRouter.get('/manager-only', verifyRole(UserRole.MANAGER), (req, res) => {
  res.json({ message: 'Esta ruta es solo para Managers' })
})

authRouter.get('/client-only', verifyRole(UserRole.CLIENT), (req, res) => {
  res.json({ message: 'Esta ruta es solo para Clients' })
})

authRouter.post('/signup', async (req: Request, res: Response): Promise<Response> => {
  const { email, password, role } = req.body
  const userRepository = AppDataSource.getRepository(User)

  const existingUser = await userRepository.findOneBy({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'The user already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const userRole = role === UserRole.MANAGER ? UserRole.MANAGER : UserRole.CLIENT

  const newUser = userRepository.create({ email, password: hashedPassword, role: userRole })
  await userRepository.save(newUser)

  return res.status(201).json({ message: 'User created successfully' })
})

authRouter.post('/signin', async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOneBy({ email })

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, 'token_secret', { expiresIn: '1h' })

  return res.json({ token })
})

authRouter.post('/signout', (req: Request, res: Response): Response => {
  return res.json({ message: 'Logout successful' })
})

export default authRouter
