import { AccountInfo, ChainInfo } from "@/types/walletTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: {} as AccountInfo,
  network: {} as ChainInfo,
};

// 创建一个名为 wallet 的 slice，包含初始状态和 reducers。
export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    saveAccountInfo: (state, action) => {
      state.account = action.payload;
    },
    saveNetworkInfo: (state, action) => {
      state.network = action.payload;
    },
  },
});

export const { saveAccountInfo, saveNetworkInfo } = walletSlice.actions;
// 提取并导出 slice 的 reducer 函数，用于在 store 中注册这个 slice
export default walletSlice.reducer;
