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





