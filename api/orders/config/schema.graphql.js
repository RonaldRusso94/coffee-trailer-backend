module.exports = {
  definition: `type OrderPrice {
    id: ID!
    price: Int
    user: UsersPermissionsUser
    promos: [Promos]
    order_items: [OrderItem]
    }
    extend type Orders {
      price: Int
    }
    `,
  query: `
      orderWithPrice (id: ID!): OrderPrice
    `,
  resolver: {
    Query: {
      orderWithPrice: {
        description: "Return the restaurants open by the category",
        resolver: "application::orders.orders.findOne", // Will apply the same policy on the custom resolver as the controller's action `findByCategories`.
      },
    },
    Orders: {
      price: {
        description: "Current price of order",
        resolverOf: "application::orders.orders.findOne", // Will apply the same policy on the custom resolver as the controller's action `findByCategories`.
        resolver: (obj) => {
          const price = strapi.services.orders.findPrice(obj);

          return price;
        },
      },
    },
  },
};
