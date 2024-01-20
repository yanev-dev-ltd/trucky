export type useAddClientProps = {
    onSave: (clientId: string) => void
    setOpen: (open: boolean | string) => void
    open: boolean | string
    changeField?: (field: string, value: string) => void
    newClient?: NewClient | undefined
    newClientLoading?: boolean
    redirectToEdit?: boolean
}

export type AddClientProps = {
    save: () => void
    setOpen: (open: boolean | string) => void
    open: boolean | string
    changeField: (field: string, value: string) => void
    newClient?: NewClient | undefined
    newClientLoading?: boolean
}

export type NewClient = {
    name?: string
    contactPerson?: string
    phone?: string
    email?: string
    address?: string
}