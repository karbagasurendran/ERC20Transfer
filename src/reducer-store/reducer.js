import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    address: 0,
    provider: "",
    Isconnected: false
  },
  reducers: {
    adduser: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
     return state = {...state,...action.payload}
    },
    removeuser: (state,action) => {
     return state ={}
    },
  },
})

// Action creators are generated for each case reducer function
export const { adduser, removeuser } = userSlice.actions

export default userSlice.reducer