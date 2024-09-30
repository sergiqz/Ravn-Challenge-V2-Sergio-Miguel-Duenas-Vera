## Ravn-Challenge-V2-Sergio-Miguel-Duenas-Vera
Welcome to my Snack Shop API project for Ravn.
I have divided it into two parts: Authentication and Shop.
The Shop section is further divided based on roles: Manager Role, Client Role, and Free access.

## Commands
- npx tsc
- node dist/server.js

## Commands test
- npm test

# Authentication

### Signup
- Method: POST
- Endpoint: /auth/signup
### Signin
- Method: POST
- Endpoint: /auth/signin
### Signout
- Method: POST
- Endpoint:/auth/signout

# Snack Store
## Manager ROL

### Create products
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

### Update products
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

### Delete products
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

### Disable products
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer


### Show client orders
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer


### Upload images per product
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

# Client ROL

### See Products
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer
### See the product details
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

### Buy products
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

### Add to Cart
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

### Like Product
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

### Show my order
- Method: POST
- Endpoint: /graphql
- Headers: Authorization: Bearer

## free
### See Products
Method: POST
Endpoint: /graphql
