import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Maintenances } from '@/components/maintenance/types'

const initialState: Maintenances = [{ key: 'loading' }]


export const maintenancesSlice = createSlice({
    name: 'maintenances',
    initialState,
    reducers: {
      setMaintenances: (state, action: PayloadAction<Maintenances>) => {
        return action.payload
      },
    },
  })

  export const { setMaintenances } = maintenancesSlice.actions
  export default maintenancesSlice.reducer