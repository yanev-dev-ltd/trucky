import { useState, useCallback, useEffect } from 'react'
import type { useOrderDialogProps } from '../types'
import type { Order } from '@/components/orders/types'
import { useIntl } from 'react-intl'
import { firestore, auth } from '@/services/firebase'
import { doc,  collection, updateDoc } from 'firebase/firestore'
const useOrderDialog = ({ open, setOpen, addOrder, editOrder, order, deleteOrder, locations, date, routeId, vehicleId }: useOrderDialogProps) => {
    const intl = useIntl()
    const [newOrder, setNewOrder] = useState<Order>()
    const changeField = useCallback((field: string, value: any) => {
        if (field === 'object') setNewOrder({ ...newOrder, ...value})
        else setNewOrder({ ...newOrder, [field]: value })
    }, [newOrder])
    useEffect(() => {
        if (!order?.reference) changeField(
            'reference',
            `[${
                newOrder?.startStop?.code || intl.formatMessage({ id: 'app.StartStop'})
            }] - [${newOrder?.endStop?.code || intl.formatMessage({ id: 'app.EndStop'})}]`
        )
    }, [newOrder?.startStop, newOrder?.endStop, order?.reference])

    useEffect(() => {
        if (!order?.key) setNewOrder({ ...newOrder, reference: '', startStop: undefined, endStop: undefined })
    }, [newOrder?.routeId, order?.key])

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
                const newOrderRef = doc(collection(firestore, 'orders')).id
                if (newOrderRef) setNewOrder({ ...newOrder, key: newOrderRef, vehicleId: vehicleId || newOrder?.vehicleId, userId: auth.currentUser.uid, date: new Date().getTime()})
            }

        }
    }, [order, newOrder, routeId, vehicleId])

    const editOrderCallback = useCallback(async (order: Order) => {
        if (!order.key) return
        if (editOrder) {
            editOrder(order)
        } else {
            const { key, ...rest } = order
            await updateDoc(doc(firestore, 'orders', order.key), rest)
            setOpen(false)
            setNewOrder(undefined)
        }
    
    }, [])

    return {
        open,
        setOpen,
        addOrder,
        editOrder: editOrderCallback,
        order: newOrder,
        isNew: !Boolean(order?.key),
        deleteOrder,
        changeField,
        locations,
        setNewOrder,
        routeId
    }
}

export default useOrderDialog