import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ref, onValue } from 'firebase/database'
import { db } from '@/services/firebase'

const useSubscription = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [subscription, setSubscription] = useState<string>('')

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

    return { subscription }
}

export default useSubscription