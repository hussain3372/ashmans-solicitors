import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import formSlice from "../features/Forms/formSlice";
import { AuthState } from "../shared/types/auth";
import authSlice from "./slices/authSlice";
import offencesSlice from "./slices/offencesSlice";

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  offences: offencesSlice,
  [formSlice.name]: formSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = {
  auth: AuthState;
};

export type AppDispatch = typeof store.dispatch;
export type RootAppState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootAppState> = useSelector;
