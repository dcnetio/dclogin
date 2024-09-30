import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  initState: 0, // number 0未初始化，1初始化中，2初始化成功，3初始化失败
};

// 创建一个名为 app 的 slice，包含初始状态和 reducers。
export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        saveInitState: (state, action) => {
            state.initState = action.payload;
        },
    },
})

export const { saveInitState } = appSlice.actions;
// 提取并导出 slice 的 reducer 函数，用于在 store 中注册这个 slice
export default appSlice.reducer;
