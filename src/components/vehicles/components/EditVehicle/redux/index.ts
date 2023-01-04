import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Services } from '../../../types'

const initialState: Services = []


export const vehicleServiceSlice = createSlice({
    name: 'vehicleService',
    initialState,
    reducers: {
      setVehicleService: (state, action: PayloadAction<Services>) => {
        return action.payload
      },
    },
  })

  export const { setVehicleService } = vehicleServiceSlice.actions
  export default vehicleServiceSlice.reducer