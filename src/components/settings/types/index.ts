import { Stripe } from '@stripe/stripe-js';
export type useSettingsProps = {
    section?: string;
}

export type SettingsViewProps = {
    section?: string;
    stripePromise: Promise<Stripe | null> | null;
}