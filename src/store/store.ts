import { configureStore } from '@reduxjs/toolkit'
// import thunk from 'redux-thunk';
import authReducer from '../providers/AppAuthProvider/redux';
import settingsReducer from '../providers/AppUiProviders/redux'

const reducer = {
    auth: authReducer,
    settings: settingsReducer
}

const store = configureStore({
    reducer,
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch