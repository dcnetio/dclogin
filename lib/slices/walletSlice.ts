import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    mnemonic: 0,
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        saveWallet: (state, action) => {
            state.mnemonic = action.payload;
        },
    },
})

export const { saveWallet } = walletSlice.actions;
