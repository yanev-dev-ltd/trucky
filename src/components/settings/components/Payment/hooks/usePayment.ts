import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '@/store/store'
import { db, auth } from '@/services/firebase'
import { setCard } from '../redux'
import { loadStripe, Stripe } from '@stripe/stripe-js'

const usePayment = () => {
    const dispatch = useDispatch()
    const card = useSelector((state: RootState) => state.card)
    const [formOpened, setFormOpened] = useState(false)
    const { settings } = useSelector((state: RootState) => state.settings)
    const { locale } = settings
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onValue(ref(db, 'stripe_customers/' + auth.currentUser?.uid + '/card'), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setCard({
                brand: snp.brand,
                country: snp.country,
                email: snp.email,
                exp_month: snp.exp_month,
                exp_year: snp.exp_year,
                last4: snp.last4,
                name: snp.name,
                phone: snp.phone,
            }))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])

    const stripePromise = locale && process.env.TRUCKY_STRIPE_API_KEY ? loadStripe(process.env.TRUCKY_STRIPE_API_KEY, { locale }) : null

    const handleFormOpen = () => {
        setFormOpened(true)
    }
    
    const handleFormClose = () => {
        setFormOpened(false)
    }

    const deleteCard = () => {
        console.log('delete card')
    }

    return { card, stripePromise, handleFormOpen, handleFormClose, formOpened, deleteCard }
}

export default usePayment