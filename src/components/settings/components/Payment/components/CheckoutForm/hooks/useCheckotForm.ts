import { useState, ChangeEvent, SyntheticEvent } from 'react'
import { auth, db } from '@/services/firebase'
import { ref, update } from 'firebase/database'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCheckoutFormProps } from '../types'

const useCheckoutForm = ({ handleFormClose }: useCheckoutFormProps) => {
    const stripe = useStripe()
    const elements = useElements()
    const [cardError, setCardError] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({
        email: '',
        phone: '',
        name: '',
    })

    const handleChange =
        (prop: string) => (event: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.value })
        }

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
                billing_details: values,
            })

            if (error) {
                // console.log('[error]', error);
                setCardError(
                    error.code === 'parameter_invalid_empty'
                        ? error.param
                        : error.code
                )
                setTimeout(() => {
                    setCardError(undefined)
                }, 10000)
            } else {
                // setCard({
                //   email: paymentMethod?.billing_details?.email,
                //   phone: paymentMethod?.billing_details?.phone,
                //   name: paymentMethod?.billing_details?.name,
                //   number: paymentMethod?.card?.last4
                // });
                setLoading(true)
                update(ref(db, 'stripe_customers/' + auth.currentUser.uid), {
                    payment_method_id: paymentMethod.id,
                })
                // window.alert('Payment method added.');
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