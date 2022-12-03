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
    const [subscription, setSubscription] = useState<string>('loading')
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
        onValue(ref(db, 'stripe_customers/' + user), (snapshot) => {
            const snp = snapshot.val()
            if (snp?.status) setSubscription(snp.status)
        })
    }, [user])
    return { user, subscription }
}

export default useAppAuthProvider