import { Router, Request, Response } from 'express'
import { User } from '../entities/User'
import { AppDataSource } from '../data-source'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authRouter = Router()

authRouter.post('/signup', async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body
    const userRepository = AppDataSource.getRepository(User)
  
    const existingUser = await userRepository.findOneBy({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'The user already exists' })
    }
  
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = userRepository.create({ email, password: hashedPassword })
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
  
    const token = jwt.sign({ userId: user.id }, 'token_secret', { expiresIn: '1h' })
  
    return res.json({ token })
  })
  
  authRouter.post('/signout', (req: Request, res: Response): Response => {
    return res.json({ message: 'Logout successful' })
  })
  