import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order';
import { Cart } from './Cart';

export enum UserRole {
  CLIENT = 'client',
  MANAGER = 'manager',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Roles de los usuarios',
});

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.client)
  orders!: Order[];

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.client)
  carts!: Cart[];
  
  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;
}
