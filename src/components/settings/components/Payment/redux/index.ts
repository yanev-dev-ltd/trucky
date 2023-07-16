import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Card } from '../types'

const initialState: Card = { loading: true }


export const cardSlice = createSlice({
    name: 'cardService',
    initialState,
    reducers: {
      setCard: (state, action: PayloadAction<Card>) => {
        return action.payload
      },
    },
  })

  export const { setCard } = cardSlice.actions
  export default cardSlice.reducer