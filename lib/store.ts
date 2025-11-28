// "use client";
import logger from "redux-logger";
import storage from 'redux-persist/lib/storage'; 
import {configureStore, combineReducers} from '@reduxjs/toolkit'
import {appSlice} from "@/lib/slices/appSlice";
import {walletSlice} from "@/lib/slices/walletSlice";
import { authSlice } from "./slices/authSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// 1.创建persist配置
const persistConfig = {
    key: 'root',
    storage,
    whitelist: [], // 只持久化关键数据
  };
  // 2.创建持久化的reducer
const rootReducer = combineReducers({
    [walletSlice.name]: walletSlice.reducer,
    [appSlice.name]: appSlice.reducer,
    [authSlice.name]: authSlice.reducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer);
 
// 3.创建 Redux store
// configureStore：创建 Redux store，并应用中间件和 reducer。
// getDefaultMiddleware：获取 Redux Toolkit 提供的默认中间件。
// serializableCheck：配置中间件以忽略特定的 redux-persist 动作（如 FLUSH、REHYDRATE 等），避免序列化检查错误。
export const store = configureStore({
    devTools: false,
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            // 忽略序列化检查
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            },
            whitelist: ['auth'], // 🔥 只持久化auth状态
            timeout: 50,         // 🔥 50ms超时
        }).concat(logger)
});
// 4.创建 persistor
// persistStore：创建一个 persistor 对象，用于控制持久化进程。
export const persistor = persistStore(store);


// 5.从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
