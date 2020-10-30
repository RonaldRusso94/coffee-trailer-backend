'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async fetchAuthenticatedUser(id) {
        debugger
        const user =  await strapi.query("user", "users-permissions").findOne({ id }, ["role", "orders"]);
        return user;
    }
};
