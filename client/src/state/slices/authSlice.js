import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:"",
        isAuthenticated:false,
        acessToken:""
    },
    reducers:{
        setAuth:(state,action) =>{
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        setUser:(state,action) =>{
            state.user = action.payload.user
        },
        resetDetails :(state)=>{
            state.user = "";
            state.isAuthenticated = false;
        }
    }
})

export default authSlice.reducer;

export const {setAuth,setUser,resetDetails} = authSlice.actions;