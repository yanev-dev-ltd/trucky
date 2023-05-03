import type { Order } from '@/components/orders/types'

export type useOrderDialogProps = {
    open: boolean
    setOpen: (value: boolean) => void
    addOrder: (order: Order) => void
    order?: Order
    isNew?: boolean
    deleteOrder?: () => void
}

export type OrderDialogProps = {
    open: boolean
    setOpen: (value: boolean) => void
    addOrder: (order: Order) => void
    order?: Order
    isNew?: boolean
    deleteOrder?: () => void
    setNewOrder: (value: Order) => void
}