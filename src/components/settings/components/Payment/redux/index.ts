import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Stripe } from '../types'

const initialState: Stripe = { loading: true }


export const stripeSlice = createSlice({
    name: 'stripeService',
    initialState,
    reducers: {
      setStripe: (state, action: PayloadAction<Stripe>) => {
        return action.payload
      },
    },
  })

  export const { setStripe } = stripeSlice.actions
  export default stripeSlice.reducer