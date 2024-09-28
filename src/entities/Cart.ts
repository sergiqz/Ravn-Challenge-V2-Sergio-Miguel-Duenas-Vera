import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { Product } from './Product';

@ObjectType()
@Entity()
export class Cart {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.carts)
  client!: User;

  @Field(() => [Product])
  @ManyToMany(() => Product)
  @JoinTable()
  products!: Product[];

  @Field()
  @Column()
  totalQuantity!: number;
}
