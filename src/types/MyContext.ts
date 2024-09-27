import { Request, Response } from 'express'

export interface MyContext {
  req: Request
  res: Response
  user?: {
    userId: number
    role: string
  } | null
}
