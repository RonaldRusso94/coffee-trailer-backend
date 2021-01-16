'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async find(params, populate) {
    const categories = await strapi.query('categories').find(params, populate);
    const categoriesReturn = await Promise.all(categories.map(async (category) => {
      const menuItems = await Promise.all(category.menu_items.map(async (menuItem) => {
        const menuToppings = await strapi.query('menu-topping').find({id:{$in: menuItem.menu_toppings}}, populate)
        return {
          ...menuItem,
          menu_toppings: menuToppings
        }
      }))
      return {
        ...category,
        menu_items: menuItems
      }
    }))
    return categoriesReturn
  },
};
