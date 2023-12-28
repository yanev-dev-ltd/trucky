import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { setStripe } from '../redux'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

const usePayment = () => {
    const dispatch = useDispatch()
    const stripe = useSelector((state: RootState) => state.stripe)
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onSnapshot(doc(firestore, 'profile', auth.currentUser?.uid), (doc) => {
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
                card_error: data?.card_error,
                client_secret: data?.client_secret,
            }))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])

    useEffect(() => {
        if (!stripe.card_error || !auth?.currentUser?.uid) return
        enqueueSnackbar(intl.formatMessage({ id: `app.stripe.${stripe.card_error}` }), { variant: 'error', persist: true })
        const clearError = async () => {
            auth?.currentUser?.uid && await updateDoc(doc(firestore, 'profile', auth?.currentUser?.uid), {
                card_error: null,
            })
        }
        clearError()
    }, [stripe.card_error])

    const deleteCard = useCallback(async () => {
        if (!auth.currentUser?.uid) return
        await updateDoc(doc(firestore, 'profile', auth.currentUser.uid), {
            payment_method_id: null,
            card_brand: null,
            card_country: null, 
            card_email: null,
            card_exp_month: null, 
            card_exp_year: null, 
            card_last4: null,
            card_name: null,
            card_phone: null,
            client_secret: null,
        })
    },[])

    return { stripe, deleteCard }
}

export default usePayment