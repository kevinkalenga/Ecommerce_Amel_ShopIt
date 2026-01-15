import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import { setIsAuthenticated, setUser, setLoading } from '../features/userSlice'


// creation de l'api
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery:fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        credentials: "include"

    }),
    tagTypes: ["User"],
    
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => `/me`,
            transformResponse: (result) => result.user,
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
               try {
                 const {data} = await queryFulfilled;
                 dispatch(setUser(data))
                 dispatch(setIsAuthenticated(true))
                 dispatch(setLoading(false))
               } catch (error) {
                  dispatch(setLoading(false))
                  console.log(error)
               }
            },
            providesTags: ["User"]
        }),
        updateProfile: builder.mutation({
            query(body) {
                return {
                    url:"/me/update",
                    method:"PUT",
                    body
                }
            },
             providesTags: ["User"]
        })
    })

})

export const {useGetMeQuery, useUpdateProfileMutation} = userApi