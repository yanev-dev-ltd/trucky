import { FC, PropsWithChildren } from 'react'
import store from '../../store/store'
import { Provider } from 'react-redux'

const AppReduxProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>
}

export default AppReduxProvider
