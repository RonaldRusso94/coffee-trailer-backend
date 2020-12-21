module.exports = {
  definition: `type OrderPrice {
    id: ID!
    price: Int
    user: UsersPermissionsUser
    promos: [Promos]
    order_items: [OrderItem]
    }`,
  query: `
      orderWithPrice (id: ID!): OrderPrice
    `,
  resolver: {
    Query: {
      orderWithPrice: {
        description: 'Return the restaurants open by the category',
        resolver: 'application::orders.orders.findOne', // Will apply the same policy on the custom resolver as the controller's action `findByCategories`.
      },
    },
  },
};