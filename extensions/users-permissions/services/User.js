'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async fetchAuthenticatedUser(id) {
        const user =  await strapi.query("user", "users-permissions").findOne({ id }, ["role", "orders"]);
        const favorites = await strapi.query('favorite').find({user: id,  _sort: 'count:desc', _limit: 10}, ["menu_item"]);
        const favoriteMenuItem = favorites.map(favorite => favorite.menu_item )
        user.favorites = favoriteMenuItem
        return user;
    }
};
