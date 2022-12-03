import { createSlice } from '@reduxjs/toolkit'

const initialState = { user: 'loading' }


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      login: (state, action) => {
        state.user = action.payload
      },
      logout: (state) => {
        state.user = 'anonymous'
      }
    },
  })

  export const { login, logout } = authSlice.actions
  export default authSlice.reducer