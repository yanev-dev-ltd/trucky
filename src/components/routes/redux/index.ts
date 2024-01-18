import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Route } from '../types'

export const initialState: Route[] = [{ key: 'loading' }]


export const routesSlice = createSlice({
    name: 'routes',
    initialState,
    reducers: {
      setRoutes: (state, action: PayloadAction<Route[]>) => {
        return action.payload
      },
    },
  })

  export const { setRoutes } = routesSlice.actions
  export default routesSlice.reducer