import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Driver } from '../types'

const initialState: Driver[] = [{ key: 'loading' }]


export const driversSlice = createSlice({
    name: 'driversService',
    initialState,
    reducers: {
      setDrivers: (state, action: PayloadAction<Driver[]>) => {
        return action.payload
      },
    },
  })

  export const { setDrivers } = driversSlice.actions
  export default driversSlice.reducer