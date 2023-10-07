import { useSettingsProps } from '../types'
import { loadStripe } from '@stripe/stripe-js'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

const useSettings = ({ section }: useSettingsProps) => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const { locale } = settings
    const stripePromise = locale && process.env.TRUCKY_STRIPE_API_KEY ? loadStripe(process.env.TRUCKY_STRIPE_API_KEY, { locale }) : null
    return { section, stripePromise }
}

export default useSettings