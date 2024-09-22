import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../features/auth/authSlice'
import { authApi } from '../services/auth'
import { marketApi } from '../services/market'
import { userApi } from '../services/user'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [marketApi.reducerPath]: marketApi.reducer,
    [userApi.reducerPath]: userApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(marketApi.middleware, authApi.middleware, userApi.middleware),

})

setupListeners(store.dispatch)