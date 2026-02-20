import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Creation des api

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery:fetchBaseQuery({
         baseUrl: "http://localhost:4000/api/v1",
         credentials: 'include',
        // baseUrl: "/api/v1",
        // prepareHeaders: (headers, {getState}) => {
        //     const token = getState().auth?.user?.token;
        //     if(token) headers.set("Authorization", `Bearer ${token}`);
        //     return headers
        // }
        

    }),
     tagTypes:["Product"],

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: "/products",
                params:params
              
            })
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
            
        }),
        invalidatesTags: ["Product"],
        
        createReview:builder.mutation({
            query:({productId, rating, comment}) => ({
                url: `/products/${productId}/reviews`,
                method: "POST",
                body: {rating, comment}
            }),
             invalidatesTags: (result, error, {productId}) => [
            {type: "Product", id: productId},
          ]
        }),
        submitReview: builder.mutation({
            query(body) {
                return {
                    url:"/reviews",
                    method: "PUT",
                    body
                }
            }
        })
       
    })
})

export const {useGetProductsQuery, useGetProductDetailsQuery, useCreateReviewMutation, useSubmitReviewMutation} = productApi