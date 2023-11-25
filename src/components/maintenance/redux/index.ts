import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Maintenance } from '@/components/maintenance/types'

const initialState: Maintenance[] = [{ key: 'loading' }]


export const vehicleMaintenanceSlice = createSlice({
    name: 'vehicleMaintenance',
    initialState,
    reducers: {
      setVehicleMaintenance: (state, action: PayloadAction<Maintenance[]>) => {
        return action.payload
      },
    },
  })

  export const { setVehicleMaintenance } = vehicleMaintenanceSlice.actions
  export default vehicleMaintenanceSlice.reducer