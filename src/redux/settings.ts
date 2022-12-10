import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Settings } from '../types/settings'
import { PaletteMode } from '../styles/theme'

const initialState = { settings: { theme: PaletteMode.Light , locale: 'en', units: 'm' }}


export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      setSettings: (state, action: PayloadAction<Settings>) => {
        state.settings = action.payload
      },
    },
  })

  export const { setSettings } = settingsSlice.actions
  export default settingsSlice.reducer