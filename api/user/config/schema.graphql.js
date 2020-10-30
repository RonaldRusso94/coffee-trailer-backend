module.exports = {
  definition: `
   extend type UsersPermissionsMe {
        name: String
        orders: [Orders]
    }
  `,
  query: `
    self: UsersPermissionsUser
  `,
  resolver: {
    Query: {
      self: {
        resolver: "plugins::users-permissions.user.me",
      },
    },
  },
};
