import { useSettingsProps } from '../types'
import { loadStripe } from '@stripe/stripe-js'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, firestore } from '@/services/firebase'
import { setProfile } from '../components/Profile/redux'

const useSettings = ({ section, checkoutFormOpen }: useSettingsProps) => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const profile = useSelector((state: RootState) => state.profile)
    const { locale } = settings
    const dispatch = useDispatch()
    useEffect(() => {
        if (!auth?.currentUser?.uid) return
        const unsubscribe = onSnapshot(doc(firestore, 'profile', auth?.currentUser?.uid), (doc) => {
            const data = doc.data()
            data && dispatch(setProfile(data))
        })
        return () => unsubscribe()
    }, [])
    const stripePromise = locale && process.env.TRUCKY_STRIPE_API_KEY ? loadStripe(process.env.TRUCKY_STRIPE_API_KEY, { locale }) : null
    return { section, stripePromise, client_secret: profile?.client_secret, checkoutFormOpen }
}

export default useSettings