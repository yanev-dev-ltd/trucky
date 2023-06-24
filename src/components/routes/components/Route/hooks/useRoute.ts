import { useState, useCallback, useEffect } from 'react'
import useLocalStorage from '@/hooks/useLocalStorage'
import { db, auth } from '@/services/firebase'
import { ref, update, push, onValue, query, orderByChild, equalTo, get } from 'firebase/database'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { Update } from '../../../types'
import { snapshotToArray } from '@/utils/globalUtils'


const useRoute = (routeId?: string, drivers?: string[], vehicleId?: string) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const [route, setRoute] = useLocalStorage('route', {})
    const [distance, setDistance] = useState<number[]>([])
    const [toll, setToll] = useState<number[]>([])
    const [ferry, setFerry] = useState<boolean[]>([])
    const [noRoute, setNoRoute] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [deleteRouteOpen, setDeleteRouteOpen] = useState<boolean>(false)
    const router = useRouter()

    const changeField = useCallback((field: string, value: any) => {
        setRoute({ ...route, [field]: value })
    }, [route])
    const clearRoute = useCallback(() => {
        setRoute({})
        setDistance([])
        setToll([])
        setFerry([])
        setNoRoute(false)
        setDeleteRouteOpen(false)
    }, [])
    useEffect(() => {
        if (!routeId && !Boolean(route.drivers)) {
            setRoute({ drivers })
        }
    }, [drivers, routeId, route])

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            clearRoute()
            vehicleId ? router.push(`/vehicles/${vehicleId}`) : router.push('/routes')
            return
        }
        if (!routeId && !route.key) {
            const postRouteRef = ref(db, 'routes/' + auth.currentUser.uid)
            const newRouteRef = push(postRouteRef)
            setRoute({ ...route, key: newRouteRef.key, vehicle: vehicleId })
        }
    }, [route, auth.currentUser?.uid, routeId])

    useEffect(() => {
        if (!routeId) return
        const routeRef = ref(db, 'routes/' + auth.currentUser?.uid + '/' + routeId)
        
        const unsubscribe = onValue(routeRef, (snapshot) => {
            const data = snapshot.val()
            const ordersRef = query(ref(db, 'orders/' + auth.currentUser?.uid), orderByChild('route'), equalTo(snapshot.key))
            get(ordersRef).then((snapshotOrder) => setRoute({ ...data, key: routeId, orders: snapshotOrder.val() ? snapshotToArray(snapshotOrder.val()) : []}))
        })
        return () => unsubscribe()
    }, [routeId])

    const saveRoute = useCallback(async () => {
        if (!auth.currentUser?.uid) return
        const { key, orders, ...routeData} = route
        const updates: Update = {}
        updates['/routes/' + auth.currentUser.uid + '/' + key as keyof Update] = { ...routeData, distance, toll, ferry }
        if (orders)
            for (const order of orders) {
                const { key: orderKey, shouldDelete, ...orderData } = order
                updates['/orders/' + auth.currentUser.uid + '/' + orderKey as keyof Update] = shouldDelete ? {} : { ...orderData, route: key }
            }
        try {
            await update(ref(db), updates)
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
        const { key, orders } = route
        const updates: Update = {}
        updates['/routes/' + auth.currentUser.uid + '/' + key as keyof Update] = {}
        if (orders)
            for (const order of orders) {
                const { key: orderKey } = order
                updates['/orders/' + auth.currentUser.uid + '/' + orderKey as keyof Update] = {}
            }
        try {
            await update(ref(db), updates)
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
    }, [])

    return {
        route,
        changeField,
        distance,
        setDistance,
        toll,
        setToll,
        ferry,
        setFerry,
        setNoRoute,
        noRoute,
        loading,
        setLoading,
        clearRoute,
        saveRoute,
        deleteRoute,
        setDeleteRouteOpen,
        deleteRouteOpen
    }
}

export default useRoute
