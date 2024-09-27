import { createSlice } from "@reduxjs/toolkit";

interface accountInfo {
    name: string,
    address: string
}
const initialState = {
    account: {} as accountInfo,
};

// 创建一个名为 wallet 的 slice，包含初始状态和 reducers。
export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        saveAccountInfo: (state, action) => {
            state.account = action.payload;
        },
    },
})

export const { saveAccountInfo } = walletSlice.actions;
// 提取并导出 slice 的 reducer 函数，用于在 store 中注册这个 slice
export default walletSlice.reducer;
