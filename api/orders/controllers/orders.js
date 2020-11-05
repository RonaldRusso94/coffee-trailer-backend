'use strict';
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const {sanitizeEntity } = require('strapi-utils');
module.exports = {
    async getUserOrders(ctx) {
        const { id } = ctx.params;
        const orders = await strapi.services.orders.find({ user: id });
        const ordersReturn = await Promise.all(orders.map(async order => {
            const orderItems = await Promise.all(order.order_items.map(async item => {
                const menuItems = await strapi.services["menu-items"].find({id_in: item.menu_item})
                const menuToppings = await strapi.services['menu-topping'].find({id_in: item.menu_toppings})
                const price = [...menuItems, ...menuToppings].reduce((totalPrice, food) => {
                    return parseInt(food.price) + totalPrice
                }, 0)
                return {
                    "menu_items": menuItems,
                    "menu_toppings": menuToppings,
                    price,
                    instructions: item.instructions
                 }
            }));
            const price = orderItems.reduce((totalPrice, orderItem) => {
                return  parseInt(orderItem.price) + totalPrice
            }, 0)
            return {
                number: order.number,
                status: order.status,
                order_items: orderItems,
                price


            }
        }))
        console.log(ordersReturn)
        return ordersReturn;
    },
    async update(ctx) {
        const { id } = ctx.params;
        const order = await strapi.query('orders').update({id}, ctx.request.body);
        if (order.status === "completed") {
            try {
                const itemIds = order.order_items.map((orderItem) => orderItem.menu_item)
                console.log(itemIds)

                const favorites = await Promise.all(itemIds.map(async itemId => {
                    const query = {
                        user: order.user._id,
                        menu_item: itemId,
                    }
                    const update = {
                        $inc: {count: 1},
                        $setOnInsert: {
                            user: order.user._id,
                            menu_item: itemId,
                            published_at: new Date()
                        }
                    }
                    const options = {
                        new: true,
                        upsert: true
                    }
                    return await strapi.query('favorite').model.findOneAndUpdate(query, update, options);
                }))
                
                console.log(favorites)
                } catch (error) {
                console.log(error)
            }
            // const favorites = await strapi.query('favorites').findOne({user: order.user, });
        }

    
        return sanitizeEntity(order, { model: strapi.models.orders });
      },};
