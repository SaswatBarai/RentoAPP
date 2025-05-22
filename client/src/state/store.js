import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import hideReducer from "./slices/hideNavSlice"

export const store = configureStore({
    reducer:{
        auth:authReducer,
        hideNav:hideReducer
    }
})