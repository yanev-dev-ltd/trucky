import type { Order } from '@/components/orders/types'
import type { Location } from '@/components/routes/types'

export type useOrderDialogProps = {
    open?: number | null
    setOpen: (value: number | null) => void
    addOrder?: (order: Order) => void
    editOrder?: (order: Order) => void
    order?: Order
    isNew?: boolean
    deleteOrder?: () => void
    locations?: Location[]
    date?: number
    routeId?: string
    vehicleId?: string
}

export type OrderDialogProps = {
    open?: boolean | number
    setOpen: (value: boolean) => void
    addOrder?: (order: Order) => void
    editOrder?: (order: Order) => void
    order?: Order
    isNew?: boolean
    deleteOrder?: () => void
    changeField: (field: string, value: any) => void
    locations?: Location[]
    setNewOrder: (order: Order) => void
}