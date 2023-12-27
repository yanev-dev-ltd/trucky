import { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react'
import { auth, firestore } from '@/services/firebase'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCheckoutFormProps } from '../types'
import { updateDoc, doc } from 'firebase/firestore'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'

const useCheckoutForm = ({ handleFormClose }: useCheckoutFormProps) => {
    const stripe = useStripe()
    const elements = useElements()
    const [cardError, setCardError] = useState<string | undefined>()
    const { enqueueSnackbar } = useSnackbar()
    const intl = useIntl()
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({
        email: '',
        phone: '',
        name: '',
    })
    const handleChange =
        (prop: string) => (event: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [prop]: event.target.type === 'checkbox' ? event.target.checked : event.target.value })
        }
    useEffect(() => {
        if (cardError) {
            enqueueSnackbar(intl.formatMessage({ id: `app.${cardError}` }), { variant: 'error' })
        }
    }, [cardError])

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
            setLoading(true)
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: values,
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
                await updateDoc(doc(firestore, 'profile', auth.currentUser.uid), {
                    payment_method_id: paymentMethod.id,
                    card_brand: paymentMethod.card?.brand,
                    card_country: paymentMethod.card?.country,
                    card_email: paymentMethod.billing_details.email,
                    card_exp_month: paymentMethod.card?.exp_month,
                    card_exp_year: paymentMethod.card?.exp_year,
                    card_last4: paymentMethod.card?.last4,
                    card_name: paymentMethod.billing_details.name,
                    card_phone: paymentMethod.billing_details.phone,
                })
                setLoading(false)
                handleFormClose()
            }
        } catch (error) {
            console.log(error)
            setCardError('try_again')
        } finally {
            setLoading(false)
        }

        // Use your card Element with other Stripe.js APIs
    }

    return { handleChange, handleSubmit, loading, stripe }
}

export default useCheckoutForm