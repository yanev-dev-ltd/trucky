import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { firestore, auth } from '@/services/firebase'
import { setReceipts } from '../redux'
import { Receipt } from '../types'
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore'
import { RootState } from '@/store/store'
import { useSnackbar } from 'notistack'
import { FirebaseError } from '../../../../../providers/AppAuthProvider/types'
import { setStripe } from '../../Payment/redux'
import { useStripe } from '@stripe/react-stripe-js'

const useInvoices = () => {
    const [loading, setLoading] = useState(false)
    const receipts = useSelector((state: RootState) => state.receipts)
    const stripeState = useSelector((state: RootState) => state.stripe)
    const stripe = useStripe()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribeCustomers = onSnapshot(doc(firestore, 'customers', auth.currentUser?.uid), (doc) => {
            const data = doc.data()
            if (!data?.try_payment) setLoading(false)
        })
        const q = query(collection(firestore, 'receipts'), where('userId', '==', auth.currentUser?.uid), orderBy('date', 'desc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const receipts: Receipt[] = []
            querySnapshot.forEach((doc) => {
                receipts.push({...doc.data(), key: doc.id})
            })
            dispatch(setReceipts(receipts))
        })

        const unsubscribeStripe = onSnapshot(doc(firestore, 'profile', auth.currentUser?.uid), (doc) => {
            const data = doc?.data()
            dispatch(setStripe({
                card_brand: data?.card_brand,
                card_country: data?.card_country,
                card_email: data?.card_email,
                card_exp_month: data?.card_exp_month,
                card_exp_year: data?.card_exp_year,
                card_last4: data?.card_last4,
                card_name: data?.card_name,
                card_phone: data?.card_phone,
                client_secret: data?.client_secret,
                payment_method_id: data?.payment_method_id,
            }))
        })
        return () => {
            unsubscribe()
            unsubscribeCustomers()
            unsubscribeStripe()
        }
    }, [auth.currentUser?.uid])

    const makePayment = async (receiptId: string | undefined) => {
        if (!receiptId || !auth?.currentUser?.uid) return
        const receipt = receipts.find((r) => r.key === receiptId)
        setLoading(true)
        if (receipt?.client_secret) {
            const intent = await stripe?.retrievePaymentIntent(receipt.client_secret || '')
            console.log(intent?.paymentIntent?.status)
            if (intent?.paymentIntent?.status === 'requires_action' || intent?.paymentIntent?.status === 'requires_payment_method') {
                const result = await stripe?.confirmCardPayment(receipt.client_secret || '', {
                    payment_method: stripeState.payment_method_id,
                })
                if (result?.error) {
                    enqueueSnackbar(result.error.message, { variant: 'error', persist: true })
                    setLoading(false)
                    return
                }
                return
            }
            return
        }
        try {
            await updateDoc(doc(firestore, 'receipts', receiptId), {
                try_payment: true
            })
        } catch (error) {
            enqueueSnackbar((error as FirebaseError).message, { variant: 'error', persist: true })
        }
    }

    return { receipts, makePayment, loading, card_last4: stripeState.card_last4 }
}

export default useInvoices