import { useState, useEffect } from 'react'
import type { useOrderDialogProps } from '../types'
const useOrderDialog = ({ open, setOpen, addOrder, order }: useOrderDialogProps) => {
    const [newOrder, setNewOrder] = useState(order)
    return { open, setOpen, addOrder, order: newOrder, isNew: order?.key }
}

export default useOrderDialog