import { Driver } from '@/components/drivers/types'
export type useAddDriverProps = {
    onSave: (driverId: string) => void
    setOpen: (open: boolean) => void
    open: boolean | string
    changeField?: (field: string, value: string) => void
    newDriver?: NewDriver | undefined
    newDriverLoading?: boolean
}

export type AddDriverProps = {
    save: () => void
    setOpen: (open: boolean) => void
    open: boolean | string
    changeField: (field: string, value: string) => void
    newDriver?: NewDriver | undefined
    newDriverLoading?: boolean
}

export type NewDriver = {
    name?: string
    phone?: string
    address?: string
}