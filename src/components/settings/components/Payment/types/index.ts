export type Stripe = {
    card_brand?: string,
    card_country?: string,
    card_email?: string,
    card_exp_month?: number,
    card_exp_year?: number,
    card_last4?: number,
    card_name?: string,
    card_phone?: string,
    card_error?: string
    client_secret?: string
    payment_method_id?: string
    loading?: boolean
}

export type PaymentViewProps = {
    checkoutFormOpen: boolean
}