export type Profile = {
    key?: string,
    firstName?: string,
    lastName?: string,
    company?: string,
    city?: string,
    address?: {
        country?: string,
        city?: string,
        line1?: string,
    },
    phone?: string
}