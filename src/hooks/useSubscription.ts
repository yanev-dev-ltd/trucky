import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore } from '@/services/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

const useSubscription = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [subscription, setSubscription] = useState<string>('')

    useEffect(() => {
        if (user === 'loading' || user === 'anonymous') {
            return
        }
        const unsubscribe = onSnapshot(doc(firestore, 'customers', user), (doc) => {
            setSubscription(doc?.data()?.status)
        })
        return () => unsubscribe()
    }, [user])

    return { subscription }
}

export default useSubscription