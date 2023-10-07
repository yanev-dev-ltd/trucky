import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Receipt } from '../types'

const initialState: Receipt[] = [{ loading: true }]


export const receiptsSlice = createSlice({
    name: 'receiptsService',
    initialState,
    reducers: {
        setReceipts: (state, action: PayloadAction<Receipt[]>) => {
        return action.payload
      },
    },
  })

  export const { setReceipts } = receiptsSlice.actions
  export default receiptsSlice.reducer