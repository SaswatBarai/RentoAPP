import {createSlice} from "@reduxjs/toolkit"


const hideNavSlice = createSlice({
    name:"hideNav",
    initialState:{
        hide:false
    },
    reducers:{
        setNav:(state,action) =>{
            state.hide = action.payload.hide;
        }
    }
})

export default hideNavSlice.reducer;
export const {setNav} = hideNavSlice.actions;    