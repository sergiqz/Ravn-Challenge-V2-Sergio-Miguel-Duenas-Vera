import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne,  JoinTable, CreateDateColumn, Column } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@ObjectType()
@Entity()
export class Order {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  client!: User;

  @Field(() => [Product])
  @ManyToMany(() => Product)
  @JoinTable()
  products!: Product[];

  @Field()
  @CreateDateColumn()
  orderDate!: Date;

  @Field()
  @Column()
  status!: string;
}
