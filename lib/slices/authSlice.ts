import { MsgStatus } from "@/config/constant";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    authInfo: {
        type: MsgStatus.success, 
        content: "",
        needLogin: false,
    },
    appInfo: {
        appId: "",
        appName: "",
        appIcon: "",
        appUrl: "",
        appVersion: "",
    },
};

// 创建一个名为 auth 的 slice，包含初始状态和 reducers。
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateAuthStep: (state, action) => {
            state.authInfo = action.payload;
        },
        updateAppInfo: (state, action) => {
            state.appInfo = action.payload;
        },
    },
})

export const { updateAuthStep, updateAppInfo } = authSlice.actions;
// 提取并导出 slice 的 reducer 函数，用于在 store 中注册这个 slice
export default authSlice.reducer;
