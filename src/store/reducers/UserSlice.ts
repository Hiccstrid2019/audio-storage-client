import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkAuth, login, logout, registration} from "./UserActions";
import {AuthResponse} from "../../models/response/AuthResponse";

interface UserState {
    isAuth: boolean,
    email: string,
    username: string,
    isLoading: boolean
}

const initialState: UserState = {
    isAuth: false,
    email: '',
    username: '',
    isLoading: true
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(registration.fulfilled, (state: UserState, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.isAuth = true;
                state.username = action.payload.userInfo.name;
                localStorage.setItem('token', action.payload.authData.accessToken);
            })
            .addCase(registration.pending, (state: UserState) => {
                state.isLoading = true;
            })
            .addCase(registration.rejected, (state: UserState) => {
                state.isLoading = false;
            })
            .addCase(login.fulfilled, (state: UserState, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.isAuth = true;
                state.username = action.payload.userInfo.name;
                localStorage.setItem('token', action.payload.authData.accessToken);
            })
            .addCase(login.pending, (state: UserState) => {
                state.isLoading = true;
            })
            .addCase(login.rejected, (state: UserState) => {
                state.isLoading = false;
            })
            .addCase(checkAuth.fulfilled, (state: UserState, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.isAuth = true;
                state.username = action.payload.userInfo.name;
                localStorage.setItem('token', action.payload.authData.accessToken);
            })
            .addCase(checkAuth.pending, (state: UserState) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.rejected, (state: UserState) => {
                state.isLoading = false;
            })
            .addCase(logout.fulfilled, (state: UserState, action: PayloadAction<void>) => {
                state.isAuth = false;
                localStorage.removeItem('token');
                state.username = '';
            })
            .addCase(logout.rejected, (state: UserState, action: PayloadAction<any>) => {
                console.log(action.payload);
            })
    }
})

export default userSlice.reducer;
