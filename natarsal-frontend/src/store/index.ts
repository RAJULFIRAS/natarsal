import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./slices/menuslice";
import reservationReducer from "./slices/reservationslice";
import uiReducer from "./slices/uislice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    reservation: reservationReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
