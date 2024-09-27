import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

// Definir los tipos de roles posibles
export enum UserRole {
  CLIENT = 'client',
  MANAGER = 'manager',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  // Aquí añadimos el campo de roles, con valor por defecto "client"
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole
}
