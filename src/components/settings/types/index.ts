import { Stripe } from '@stripe/stripe-js';
export type useSettingsProps = {
    section?: string;
    checkoutFormOpen: boolean;
}

export type SettingsViewProps = {
    section?: string;
    stripePromise: Promise<Stripe | null> | null;
    client_secret?: string;
    checkoutFormOpen: boolean;
}