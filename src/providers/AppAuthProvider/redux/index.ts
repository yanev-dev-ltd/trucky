import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../types'

const initialState = { user: undefined }


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      login: (state, action: PayloadAction<User>) => {
        { user: action.payload }
      },
      logout: (state) => {
        state.user = undefined
      }
    },
  })

  export const { login, logout } = authSlice.actions
  export default authSlice.reducer