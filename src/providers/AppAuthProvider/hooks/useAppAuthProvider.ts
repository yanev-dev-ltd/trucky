import { RootState } from '../../../store/store'
import { auth } from '../../../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { login, logout } from '../../AppAuthProvider/redux'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useSubscription from '@/hooks/useSubscription'

const useAppAuthProvider = () => {
    const dispatch = useDispatch()
    const { subscription } = useSubscription()
    const user = useSelector((state: RootState) => state.auth.user)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.uid) {
                dispatch(login(user.uid))
            } else {
                dispatch(logout())
            }
        })
        return () => unsubscribe()
    }, [])
    
    return { user, subscription }
}

export default useAppAuthProvider