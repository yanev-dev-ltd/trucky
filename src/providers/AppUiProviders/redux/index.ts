import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Settings } from '../types'

const initialState = { theme: 'light', locale: 'en', units: 'm' }


export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      set: (state, action) => {
        state = action.payload
      },
    },
  })

  export const { set } = settingsSlice.actions
  export default settingsSlice.reducer