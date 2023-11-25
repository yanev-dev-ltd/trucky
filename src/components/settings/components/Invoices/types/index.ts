import { Stripe } from '@stripe/stripe-js';
export type Receipt = {
    key?: string
    amount_paid?: number
    amount_due?: number
    date?: number
    invoice?: string
    receipt?: string
    status?: string
    loading?: boolean
}

export type InvoicesProps = {
    receipts: Receipt[]
    makePayment: (invoiceId: string | undefined) => void
}