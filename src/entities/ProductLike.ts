import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { Product } from './Product';

@ObjectType()
@Entity()
export class ProductLike {
    @Field()
    @PrimaryColumn()
    userId!: number;

    @Field()
    @PrimaryColumn()
    productId!: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
    user!: User;

    @Field(() => Product)
    @ManyToOne(() => Product, (product) => product.likes, { onDelete: 'CASCADE' })
    product!: Product;
}
