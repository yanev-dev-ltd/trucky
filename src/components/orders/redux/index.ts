import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order } from '../types'

export const initialState: Order[] = [{ key: 'loading' }]


export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
      setOrders: (state, action: PayloadAction<Order[]>) => {
        return action.payload
      },
    },
  })

  export const { setOrders } = ordersSlice.actions
  export default ordersSlice.reducer