import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Client } from '../types'

const initialState: Client[] = [{ key: 'loading' }]


export const clientsSlice = createSlice({
    name: 'clientsService',
    initialState,
    reducers: {
      setClients: (state, action: PayloadAction<Client[]>) => {
        return action.payload
      },
    },
  })

  export const { setClients } = clientsSlice.actions
  export default clientsSlice.reducer