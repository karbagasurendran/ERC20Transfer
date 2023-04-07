import { configureStore } from '@reduxjs/toolkit'
import userReduser from "./reducer"

export default configureStore({
  reducer: {
    user: userReduser
  },
})