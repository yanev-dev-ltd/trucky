import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Settings } from '../types'
import { PaletteMode } from '../../../styles/theme'

const initialState = { theme: PaletteMode.Light , locale: 'en', units: 'm' }


export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      set: (state, action: PayloadAction<Settings>) => {
        state = action.payload
      },
    },
  })

  export const { set } = settingsSlice.actions
  export default settingsSlice.reducer