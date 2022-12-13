import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Vehicles } from '../types'

const initialState = [{ key: 'loading' }]


export const vehiclesSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
      setVehicles: (state, action: PayloadAction<Vehicles>) => {
        return action.payload
      },
    },
  })

  export const { setVehicles } = vehiclesSlice.actions
  export default vehiclesSlice.reducer