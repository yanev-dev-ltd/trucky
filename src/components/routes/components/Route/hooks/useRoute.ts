import { useState, useCallback, useEffect } from 'react'
import useLocalStorage from '@/hooks/useLocalStorage'
import { auth, firestore } from '@/services/firebase'
import { writeBatch, doc, onSnapshot, collection, query, where, getDocs, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { Order } from '@/components/orders/types'
import { TruckTypes } from '@/components/vehicles/types'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'


const useRoute = (routeId?: string, drivers?: string[], vehicleId?: string) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const { settings } = useSelector((state: RootState) => state.settings)
    const [route, setRoute] = useLocalStorage('route', { currency: settings.currency || 'EUR', units: settings.units || 'km' })
    const [noRoute, setNoRoute] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [deleteRouteOpen, setDeleteRouteOpen] = useState<boolean>(false)
    const [mode, setMode] = useState<'truck' | 'car'>('truck')
    const router = useRouter()

    const changeField = useCallback((field: string, value: any) => {
        setRoute({ ...route, [field]: value })
    }, [route])

    const clearRoute = useCallback(() => {
        setRoute({ currency: settings.currency || 'EUR', units: settings.units || 'km' })
        setNoRoute(false)
        setDeleteRouteOpen(false)
    }, [])

    useEffect(() => {
        if (!vehicleId && !route.vehicleId) return
        const getMode = async () => {
            const vehicleRef = doc(firestore, 'vehicles', vehicleId || route.vehicleId)
            const vehicleSnapshot = await getDoc(vehicleRef)
            if (vehicleSnapshot.exists()) {
                const { type, trailerId } = vehicleSnapshot.data()
                setMode(TruckTypes.includes(type) ? 'truck' : 'car')
                !routeId && !route.trailerId && trailerId && changeField('trailerId', trailerId)
            }
        }
        getMode()
    }, [vehicleId, route, changeField, routeId])

    useEffect(() => {
        return () => clearRoute()
    }, [])
    useEffect(() => {
        if (!routeId && !Boolean(route.drivers) && drivers && drivers.length > 0) {
            setRoute({ drivers })
        }
    }, [drivers, routeId, route])

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            clearRoute()
            vehicleId ? router.push(`/vehicles/${vehicleId}`) : router.push('/routes')
            return
        }
    }, [route, auth.currentUser?.uid, routeId])

    useEffect(() => {
        if (!routeId) return

        const unsub = onSnapshot(doc(firestore, 'routes', routeId), async (doc) => {
            const q = query(collection(firestore, 'orders'), where('routeId', "==", routeId))
            const querySnapshot = await getDocs(q)
            const orders: Order[] = []
            querySnapshot.forEach((docOrder) => {
                orders.push({ key: docOrder.id, ...docOrder.data()})
            })
            setRoute({ key: doc.id, ...doc.data(), orders })
        })
        return () => unsub()
    }, [routeId])

    const saveRoute = useCallback(async () => {
        if (!auth.currentUser?.uid) return
        const { key, orders, ...routeData} = route
        const batch = writeBatch(firestore)
        const routeKey = key || doc(collection(firestore, 'routes')).id
        const routeRef = doc(firestore, 'routes', routeKey)
        const newVehicleId = routeData.vehicleId ?? vehicleId
        batch.set(routeRef, { ...routeData, userId: auth.currentUser.uid, vehicleId: newVehicleId })
        if (orders)
            for (const order of orders) {
                const orderRef = order.key ? doc(firestore, 'orders', order.key) : doc(collection(firestore, 'orders'))
                const { key: orderKey, shouldDelete, ...orderData } = order
                shouldDelete ? batch.delete(orderRef) : batch.set(orderRef, { ...orderData, routeId: routeKey, vehicleId: newVehicleId, userId: auth.currentUser.uid })
            }
        try {
            await batch.commit()
            enqueueSnackbar(intl.formatMessage({
                id: routeId ? 'app.RouteEdited' : 'app.RouteAdded',
            }), { variant: 'success' })
        } catch (e) {
            enqueueSnackbar(intl.formatMessage({
                id: routeId ? 'app.Error.EditingRoute' : 'app.Error.AddingRoute',
            }), { variant: 'error', persist: true })
        } finally {
            clearRoute()
            vehicleId ? router.push(`/vehicles/${vehicleId}`) : router.push('/routes')
        }
    }, [route, auth.currentUser?.uid, vehicleId, routeId])

    const deleteRoute = useCallback(async () => {
        if (!auth.currentUser?.uid) return
        const batch = writeBatch(firestore)
        const { key, orders } = route
        const routeRef = doc(firestore, 'routes', routeId || key)
        batch.delete(routeRef)
        if (orders)
            for (const order of orders) {
                const { key: orderKey } = order
                const orderRef = doc(firestore, 'orders', orderKey)
                batch.delete(orderRef)
            }
        try {
            await batch.commit()
            enqueueSnackbar(intl.formatMessage({
                id: 'app.RouteDeleted',
            }), { variant: 'success' })
            clearRoute()
            vehicleId ? router.push(`/vehicles/${vehicleId}`) : router.push('/routes')
        } catch (e) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.DeletingRoute',
            }), { variant: 'error', persist: true })
        }
    }, [route])

    return {
        route,
        changeField,
        setNoRoute,
        noRoute,
        loading,
        setLoading,
        clearRoute,
        saveRoute,
        deleteRoute,
        setDeleteRouteOpen,
        deleteRouteOpen,
        mode,
    }
}

export default useRoute
