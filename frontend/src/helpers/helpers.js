export const getPriceQueryParams = (searchParams, key, value) => {
    const newParams = new URLSearchParams(searchParams);

     if(key === "min") {
          key = "price[gte]"
     } else if (key === "max") {
       key = "price[lte]"
     }

     if(value) {
        newParams.set(key, value)
     } else {
        newParams.delete(key)
     }

     return newParams
}


export const calculateOrderCost = (cartItems) => {
   const itemsPrice = cartItems?.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
   )

   const shippingPrice = itemsPrice > 200 ? 0 : 25 
   const taxPrice = Number((0.15 * itemsPrice).toFixed(2))
   const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

   return {
      itemsPrice: Number(itemsPrice).toFixed(2),
      shippingPrice,
      taxPrice,
      totalPrice
   }
}


