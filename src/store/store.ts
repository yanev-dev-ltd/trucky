import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../providers/AppAuthProvider/redux';
import settingsReducer from '../redux/settings'
import vehiclesReducer from '../components/vehicles/redux'
import vehicleServiceReducer from '../components/vehicles/components/EditVehicle/redux'
import driversReducer from '../components/drivers/redux'
import routesReducer from '../components/routes/redux'

const reducer = {
    auth: authReducer,
    settings: settingsReducer,
    vehicles: vehiclesReducer,
    vehicleService: vehicleServiceReducer,
    drivers: driversReducer,
    routes: routesReducer,
}

const store = configureStore({
    reducer,
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch