import { useState, ChangeEvent, SyntheticEvent } from 'react'
import { auth, firestore } from '@/services/firebase'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCheckoutFormProps } from '../types'
import { updateDoc, doc } from 'firebase/firestore'

const useCheckoutForm = ({ handleFormClose }: useCheckoutFormProps) => {
    const stripe = useStripe()
    const elements = useElements()
    const [cardError, setCardError] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({
        email: '',
        phone: '',
        name: '',
        auto_payment: true
    })
    
    const handleChange =
        (prop: string) => (event: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.type === 'checkbox' ? event.target.checked : event.target.value })
        }
    const { auto_payment, ...billing_details } = values

    const handleSubmit = async (event: SyntheticEvent) => {
        // Block native form submission.
        event.preventDefault()

        if (!stripe || !elements || !auth?.currentUser?.uid) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement)
        try {
            if (!cardElement) return
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: billing_details,
            })

            if (error) {
                setCardError(
                    error.code === 'parameter_invalid_empty'
                        ? error.param
                        : error.code
                )
                setTimeout(() => {
                    setCardError(undefined)
                }, 10000)
            } else {
                setLoading(true)
                await updateDoc(doc(firestore, 'customers', auth.currentUser.uid), {
                    payment_method_id: paymentMethod.id,
                    card_brand: paymentMethod.card?.brand,
                    card_country: paymentMethod.card?.country,
                    card_email: paymentMethod.billing_details.email,
                    card_exp_month: paymentMethod.card?.exp_month,
                    card_exp_year: paymentMethod.card?.exp_year,
                    card_last4: paymentMethod.card?.last4,
                    card_name: paymentMethod.billing_details.name,
                    card_phone: paymentMethod.billing_details.phone,
                    auto_payment: auto_payment
                })
                setLoading(false)
                handleFormClose()
            }
        } catch (error) {
            setCardError('try_again')
        }

        // Use your card Element with other Stripe.js APIs
    }

    return { handleChange, handleSubmit, cardError, loading, stripe }
}

export default useCheckoutForm