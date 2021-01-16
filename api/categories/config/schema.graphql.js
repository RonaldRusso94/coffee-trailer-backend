module.exports = {
  definition: `type categoryTopping {
    id: ID!
    menu_items: [MenuItems]
    }`,
  query: `
    categoryWithTopping: categoryTopping
    `,
  resolver: {
    Query: {
      categoryWithTopping: {
        description: 'Return the restaurants open by the category',
        resolver: 'application::categories.categories.find', // Will apply the same policy on the custom resolver as the controller's action `findByCategories`.
      },
    },
  },
};