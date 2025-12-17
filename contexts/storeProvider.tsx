"use client";
import { Provider } from "react-redux";
import { persistor, store } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { PropsWithChildren } from "react";

export default function StoreProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        {children}
      </PersistGate>
    </Provider>
  );
}
