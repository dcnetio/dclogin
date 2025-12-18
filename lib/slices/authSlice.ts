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
  shouldReturnUserInfo: false,
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
    setShouldReturnUserInfo: (state, action) => {
      state.shouldReturnUserInfo = action.payload;
    },
  },
});

export const { updateAuthStep, updateAppInfo, setShouldReturnUserInfo } =
  authSlice.actions;
// 提取并导出 slice 的 reducer 函数，用于在 store 中注册这个 slice
export default authSlice.reducer;
