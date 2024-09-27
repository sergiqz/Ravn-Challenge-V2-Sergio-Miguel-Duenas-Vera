import { Field, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Product } from './Product'

@ObjectType()
@Entity()
export class Category {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.category)
  products!: Product[]
}
