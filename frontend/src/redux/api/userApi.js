import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import { setIsAuthenticated, setUser, setLoading } from '../features/userSlice'


// creation de l'api
export const userApi = createApi({
    reducerPath: "authApi",
    baseQuery:fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        

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
        })
    })

})

export const {useGetMeQuery} = userApi