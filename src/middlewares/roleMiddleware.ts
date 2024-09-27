import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '../entities/User'

interface JwtPayload {
  userId: number
  role: UserRole
}

export function verifyRole(requiredRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(403).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, 'token_secret') as JwtPayload
      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'You do not have the required role' })
      }

      req.user = decoded
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}
