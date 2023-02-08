import {createAsyncThunk} from "@reduxjs/toolkit";
import AuthService from "../../services/AuthService";
import axios, {AxiosError} from 'axios';
import {AuthError} from "../../models/response/AuthError";

interface LoginModel {
    email: string;
    password: string;
    callback: () => void;
}

interface RegisterModel {
    email: string;
    username: string;
    password: string;
    callback: () => void;
}

export const registration = createAsyncThunk(
    'user/register',
    async (model: RegisterModel, thunkAPI) => {
        try {
            const {email, username, password, callback} = model;
            const response = await AuthService.registration(email, username, password);
            callback();
            return response.data;
        } catch (e) {
            const errors = e as Error | AxiosError;
            if (axios.isAxiosError<AuthError>(errors)) {
                return thunkAPI.rejectWithValue(errors.response?.data);
            }
            return thunkAPI.rejectWithValue(e);
        }
    }
)


export const login = createAsyncThunk(
    'user/login',
    async (model:LoginModel, thunkAPI) => {
        try {
            const {email, password, callback} = model;
            const response = await AuthService.login(email, password);
            callback();
            return response.data;
        } catch (e) {
            const errors = e as Error | AxiosError;
            if (axios.isAxiosError<AuthError>(errors)) {
                return thunkAPI.rejectWithValue(errors.response?.data);
            }
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error();
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_API}/api/auth/refresh-token`,{withCredentials: true});
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async (_, thunkAPI) => {
        try {
            const response = await AuthService.logout();
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)
