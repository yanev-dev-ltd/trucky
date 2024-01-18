import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Trailers, Trailer } from '../types'

const initialState = [{ key: 'loading' } as Trailer]


export const trailersSlice = createSlice({
    name: 'trailers',
    initialState,
    reducers: {
      setTrailers: (state, action: PayloadAction<Trailers>) => {
        return action.payload
      },
    },
  })

  export const { setTrailers } = trailersSlice.actions
  export default trailersSlice.reducer