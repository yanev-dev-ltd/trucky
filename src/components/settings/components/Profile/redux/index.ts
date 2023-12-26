import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '../types'

const initialState: Profile = { key: 'loading' }


export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
      setProfile: (state, action: PayloadAction<Profile>) => {
        return action.payload
      },
    },
  })

  export const { setProfile } = profileSlice.actions
  export default profileSlice.reducer