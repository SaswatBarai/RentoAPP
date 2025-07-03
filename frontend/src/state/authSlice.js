import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    isAuthenticated : false,
    user: null,
    accessToken: null,
    refreshToken: null,
    profilePic : null
}


const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login: (state , action) => {
            const {user,accessToken,refreshToken,profilePic} = action.payload;
            console.log('user:', user, 'accessToken:', accessToken, 'refreshToken:', refreshToken, 'profilePic:', profilePic);
            state.isAuthenticated = true;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.profilePic = profilePic || null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.profilePic = null;
        },
        updateProfile: (state, action) => {
            const {profilePic} = action.payload;
            if (profilePic) {
                state.profilePic = profilePic;
            }
        },

    }
})

export const {login, logout, updateProfile} = authSlice.actions;
export default authSlice.reducer;