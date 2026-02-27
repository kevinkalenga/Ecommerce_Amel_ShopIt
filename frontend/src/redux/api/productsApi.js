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
     tagTypes:["Product", "AdminProducts"],

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: "/products",
                params:params
              
            })
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
            invalidatesTags: ["Product"],
            
        }),
        // invalidatesTags: ["Product"],
        
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
            },
            invalidatesTags: ["Product"],
        }),
        canUserReview: builder.query({
            query: (productId) => `/can_review/?productId=${productId}`,
            
        }),
        getAdminProducts: builder.query({
            query: () => `/admin/products`
        }),
        createProduct: builder.mutation({
            query(body){
                return {
                    url:"/admin/products",
                    method:"POST",
                    body
                }
            },
            invalidatesTags: ["AdminProducts"],
        }),
        updateProduct: builder.mutation({
            query({id, body}){
                return {
                    url:`/products/${id}`,
                    method:"PUT",
                    body
                }
            },
            invalidatesTags: ["Product", "AdminProducts"],
        }),
       
    })
})

export const {useGetProductsQuery, useGetProductDetailsQuery, 
    useCreateReviewMutation, useSubmitReviewMutation,
     useCanUserReviewQuery, useGetAdminProductsQuery, useCreateProductMutation, useUpdateProductMutation} = productApi