import { Field, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Category } from './Category'

@ObjectType()
@Entity()
export class Product {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @Field()
  @Column('decimal')
  price!: number

  @Field()
  @Column()
  description!: string

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.products)
  category!: Category
}
