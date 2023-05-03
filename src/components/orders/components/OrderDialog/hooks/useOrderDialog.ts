import { useState, useCallback } from 'react'
import type { useOrderDialogProps } from '../types'
const useOrderDialog = ({ open, setOpen, addOrder, order, deleteOrder }: useOrderDialogProps) => {
    const [newOrder, setNewOrder] = useState(order)

    return { open, setOpen, addOrder, order: newOrder, isNew: !Boolean(order?.key), deleteOrder, setNewOrder}
}

export default useOrderDialog