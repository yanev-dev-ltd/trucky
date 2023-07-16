import { PaletteMode } from '../types/theme'
import { StripeConstructorOptions } from '@stripe/stripe-js'

export type Settings = {
    theme: PaletteMode
    locale: StripeConstructorOptions["locale"]
    units: string
}