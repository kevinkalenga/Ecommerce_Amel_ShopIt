import { createSlice } from "@reduxjs/toolkit";

// les infos de user avant l authentification
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true
}

export const userSlice = createSlice({
    initialState,
    name: "userSlice",
    reducers: {
        setUser(state, action) {
            state.user = action.payload
        },
        setIsAuthenticated(state, action) {
               state.isAuthenticated = action.payload
        },
        setLoading(state, action) {
            state.loading = action.payload
        },
        // setCredentials(state, action) {
        //     state.user = {
        //         ...action.payload.user,
        //         token:action.payload.token
        //     },
        //     state.isAuthenticated = true;
        //     state.loading = false;
        // }
    }
})

export default userSlice.reducer 

export const {setIsAuthenticated, setUser, setLoading} = userSlice.actions