"use client";

import { checkAuth } from "@/lib/auth";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./../lib/store";
import Footer from "./Footer";

function AuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return null;
}

export default function ClientLayout({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthSync />
        {children}
        <Footer />
      </PersistGate>
    </Provider>
  );
}
