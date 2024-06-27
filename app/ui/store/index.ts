import { combineReducers, configureStore } from '@reduxjs/toolkit'
import errorSlice from './error/error-slice'

const rootReducer = combineReducers({
    errorDialog: errorSlice.reducer
    // other reducers here
})

const store = configureStore({
    reducer: rootReducer,
    // devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>

export default store