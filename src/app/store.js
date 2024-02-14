import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../Features/Counter/CounterSlice'
import toggleReducer from '../Features/Theam/toggleSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    toogle : toggleReducer,
  },
})