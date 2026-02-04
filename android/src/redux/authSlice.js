import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
console.log('api', api);
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data) => {
        const res = await api.post("/auth/login", data);
        await AsyncStorage.setItem("token", res.data.token);
        return res.data.user;
    }
)

export const signupUser = createAsyncThunk(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/register", data);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            AsyncStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Signup
        builder.addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(signupUser.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
            state.error = null;
        });
        builder.addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;