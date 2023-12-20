import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Vehicles, Vehicle } from '../types'

const initialState = [{ key: 'loading', units: 'km' } as Vehicle]


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