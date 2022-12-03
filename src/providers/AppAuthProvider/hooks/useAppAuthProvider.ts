import { RootState } from '../../../store/store'
import { auth } from '../../../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { login, logout } from '../../AppAuthProvider/redux'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const useAppAuthProvider = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(login({ id: user.uid, email: user.email}))
            } else {
                dispatch(logout())
            }
        })
        return () => unsubscribe()
    }, [])
    const user = useSelector((state: RootState) => state.auth.user)
    return user
}

export default useAppAuthProvider