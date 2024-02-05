import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../types'

const initialState = [{ key: 'loading' } as Notification]


export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
      setNotifications: (state, action: PayloadAction<Notification[]>) => {
        return action.payload
      },
    },
  })

  export const { setNotifications } = notificationsSlice.actions
  export default notificationsSlice.reducer