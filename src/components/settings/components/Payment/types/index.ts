export type Stripe = {
    card?: {
        brand?: string,
        country?: string,
        email?: string,
        exp_month?: number,
        exp_year?: number,
        last4?: number,
        name?: string,
        phone?: string,
    },
    loading?: boolean
}