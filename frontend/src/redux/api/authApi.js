import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Creation des api

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery:fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        

    }),

    endpoints: (builder) => ({
        register: builder.mutation({
            query(body){
               return {
                 url: '/register',
                 method:'POST',
                 body,
               }
              
            }
        }),
        login: builder.mutation({
            query(body){
               return {
                 url: '/login',
                 method:'POST',
                 body,
               }
              
            }
        }),
       
    })
})

export const {useLoginMutation, useRegisterMutation} = authApi;