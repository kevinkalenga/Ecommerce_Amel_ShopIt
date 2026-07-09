import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {userApi} from './userApi'

// Creation des api

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery:fetchBaseQuery({
      
   baseUrl:process.env.REACT_APP_API_URL,
   credentials: "include",
        

    }),

    endpoints: (builder) => ({
        register: builder.mutation({
            query(body){
               return {
                 url: '/register',
                 method:'POST',
                 body,
               }
              
            },
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
               try {
                 const {data} = await queryFulfilled;
                 await dispatch(userApi.endpoints.getMe.initiate(null))
               } catch (error) {
                 
                  console.log(error)
               }
            },
        }),

        login: builder.mutation({
            query(body){
               return {
                  url: '/login',
                  method:'POST',
                  body,
               }
            },
        }),
      //   login: builder.mutation({
      //       query(body){
      //          return {
      //            url: '/login',
      //            method:'POST',
      //            body,
      //          }
              
      //       },
      //       async onQueryStarted(args, {dispatch, queryFulfilled}) {
      //          try {
      //            const {data} = await queryFulfilled;
      //            await dispatch(userApi.endpoints.getMe.initiate(null))
      //          } catch (error) {
                 
      //             console.log(error)
      //          }
      //       },
      //   }),
        logout: builder.mutation({
            query: () => ({
               url: '/logout',
               method: 'GET',
            }),
        })
       
    })
})

export const {useLoginMutation, useRegisterMutation, useLogoutMutation} = authApi;