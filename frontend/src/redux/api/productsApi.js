import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Creation des api

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery:fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1"
    }),

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: "/products",
                params:params,
            })
        })
    })
})

export const {useGetProductsQuery} = productApi