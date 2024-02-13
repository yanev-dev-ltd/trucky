import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../providers/AppAuthProvider/redux';
import settingsReducer from '../redux/settings'
import vehiclesReducer from '../components/vehicles/redux'
import trailersReducer from '../components/trailers/redux'
import maintenancesReducer from '@/components/maintenance/redux'
import driversReducer from '../components/drivers/redux'
import routesReducer from '../components/routes/redux'
import clientsReducer from '../components/clients/redux'
import ordersReducer from '../components/orders/redux'
import stripeReducer from '../components/settings/components/Payment/redux'
import receiptsReducer from '../components/settings/components/Invoices/redux'
import profileReducer from '../components/settings/components/Profile/redux'
import groupsReducer from '../components/common/Group/redux'
import documentsReducer from '../components/common/Documents/redux'
import notificationsReducer from '../components/hoc/Layout/components/Header/components/Notifications/redux'

const reducer = {
    auth: authReducer,
    settings: settingsReducer,
    vehicles: vehiclesReducer,
    maintenances: maintenancesReducer,
    drivers: driversReducer,
    routes: routesReducer,
    clients: clientsReducer,
    stripe: stripeReducer,
    receipts: receiptsReducer,
    profile: profileReducer,
    groups: groupsReducer,
    trailers: trailersReducer,
    orders: ordersReducer,
    notifications: notificationsReducer,
    documents: documentsReducer,
}

const store = configureStore({
    reducer,
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch