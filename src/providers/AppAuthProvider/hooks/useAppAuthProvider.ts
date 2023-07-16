import { RootState } from '../../../store/store'
import { auth, db } from '../../../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { login, logout } from '../../AppAuthProvider/redux'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'

const useAppAuthProvider = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    const [subscription, setSubscription] = useState<string>('')
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
    useEffect(() => {
        if (user === 'loading' || user === 'anonymous') {
            return
        }
        const unsubscribe = onValue(ref(db, 'stripe_customers/' + user + '/status'), (snapshot) => {
            const snp = snapshot.val()
            setSubscription(snp)
        })
        return () => unsubscribe()
    }, [user])
    return { user, subscription }
}

export default useAppAuthProvider