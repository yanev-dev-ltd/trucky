import { Stripe } from '@stripe/stripe-js';
export type Receipt = {
    key?: string
    amount?: number
    date?: number
    invoice?: string
    invoicePdf?: string
    status?: string
    loading?: boolean
}

export type InvoicesProps = {
    receipts: Receipt[]
    makePayment: (invoiceId: string | undefined) => void
}