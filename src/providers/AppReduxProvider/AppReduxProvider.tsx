import store from '../../store/store'
import { Provider } from 'react-redux'

const AppReduxProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>
}

export default AppReduxProvider