'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const calculateOrderPrice = (totalPrice, orderItem) => {
  const menuItemsPrice = orderItem.menu_items.reduce((totalItemPrice, menuItem) => {
    const currentPrice = menuItem.current_price * menuItem.quantity;
    return totalItemPrice + currentPrice;
  }, 0)
  const toppingsPrice = orderItem.menu_toppings.reduce((totalToppingPrice, menuTopping) => {
    const currentPrice = menuTopping.current_price * menuTopping.quantity;
    return totalToppingPrice + currentPrice;
  }, 0)
  return totalPrice + menuItemsPrice + toppingsPrice;
}
const applyPromos = (totalPrice, promos) => {
  let runningPrice = totalPrice;
  for (const promo of promos){
    if(runningPrice < 0)
      return 0;
    else if (promo.amount)
      runningPrice = runningPrice - promo.amount;
    else if (promo.percentage)
      runningPrice = runningPrice - (totalPrice * promo.amount);
  }
  if (runningPrice < 0)
    return 0;
  return runningPrice;
}
module.exports = {
  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */

  async findOne(params, populate) {
    const order = await strapi.query('orders').findOne(params, populate);
    if (!order)
      return null;
    const price = strapi.services.orders.findPrice(order);
    return {
      ...order,
      price
    }
  },
  findPrice(order){
    if (!order)
      return undefined;
    else if (order.order_items.length === 0)
      return 0;
    else{
      const totalPrice  = order.order_items.reduce(calculateOrderPrice, 0)
      const reducedPrice = applyPromos(totalPrice, order.promos)
      return reducedPrice;
    }
  }
};