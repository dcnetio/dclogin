/**
 * 自定义的钩子，确保在使用 Redux 时能够利用 TypeScript 的类型检查和自动补全功能
 */
// useDispatch 和 useSelector：这是从 react-redux 库中导入的钩子，用于在 React 组件中访问 Redux 的 dispatch 函数和状态。
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// RootState 和 AppDispatch：这是从 ./index 模块中导入的类型。RootState 代表整个 Redux store 的状态类型，而 AppDispatch 代表 Redux 的 dispatch 函数的类型。
import type { RootState, AppDispatch } from './store';

// 在整个应用程序中使用，而不是简单的 `useDispatch` 和 `useSelector`
// 在没有类型定义的情况下，useDispatch 和 useSelector 是通用的，并且不知道 Redux store 的具体类型。这会导致以下问题：
// 类型安全：在使用原始的 useDispatch 和 useSelector 时，开发者可能会意外地 dispatch 错误类型的 action 或者选择器返回不正确的状态类型。自定义这些钩子可以避免这种问题。
// 开发体验：使用类型定义的钩子可以在开发过程中提供更好的自动补全和类型检查，从而减少错误和提高效率。
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;