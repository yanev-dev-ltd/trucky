import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Document } from '../types'

const initialState: Document[] = [{ key: 'loading' }]


export const documentsSlice = createSlice({
    name: 'documentsService',
    initialState,
    reducers: {
      setDocuments: (state, action: PayloadAction<Document[]>) => {
        return action.payload
      },
    },
  })

  export const { setDocuments } = documentsSlice.actions
  export default documentsSlice.reducer