import { useState, useCallback, useEffect } from 'react'
import type { useOrderDialogProps } from '../types'
import type { Order } from '@/components/orders/types'
import { format } from 'date-fns'
import { useIntl } from 'react-intl'
import { db, auth } from '@/services/firebase'
import { ref, update, push } from 'firebase/database'
const useOrderDialog = ({ open, setOpen, addOrder, editOrder, order, deleteOrder, locations, date, routeId, vehicleId }: useOrderDialogProps) => {
    const intl = useIntl()
    const [newOrder, setNewOrder] = useState<Order>()
    const changeField = useCallback((field: string, value: any) => {
        setNewOrder({ ...newOrder, [field]: value })
    }, [newOrder])
    useEffect(() => {
        if (!order?.reference) changeField(
            'reference',
            `${format(
                date || new Date(),
                'dd/MM/yy'
            )} [${
                newOrder?.startStop?.code || intl.formatMessage({ id: 'app.StartStop'})
            }] - [${newOrder?.endStop?.code || intl.formatMessage({ id: 'app.EndStop'})}]`
        )
    }, [newOrder?.startStop, newOrder?.endStop, order?.reference])

    useEffect(() => {
        if (!newOrder?.key) setNewOrder(order)
    }, [order, newOrder])

    useEffect(() => {
        if (!order && !newOrder?.key) {
            if (!auth.currentUser?.uid) {
                setOpen(false)
                setNewOrder(undefined)
                return
            }
            if (!newOrder?.key) {
                const postOrderRef = ref(db, 'orders/' + auth.currentUser.uid)
                const newOrderRef = push(postOrderRef)
                if (newOrderRef.key) setNewOrder({ ...newOrder, key: newOrderRef.key, vehicle: vehicleId, route: routeId })
            }

        }
    }, [order, newOrder, routeId, vehicleId])

    return { open, setOpen, addOrder, editOrder, order: newOrder, isNew: !Boolean(order?.key), deleteOrder, changeField, locations, setNewOrder}
}

export default useOrderDialog