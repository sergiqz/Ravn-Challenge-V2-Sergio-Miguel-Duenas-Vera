import { Field, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Category } from './Category'
import { ProductLike } from './ProductLike';

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

  @Field(() => [ProductLike])
  @OneToMany(() => ProductLike, (like) => like.product)
  likes!: ProductLike[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  image_url!: string;

  @Field()
  @Column('int', { default: 0 })
  stock!: number;

  @Field()
  @Column({ default: true })
  isActive!: boolean
}
