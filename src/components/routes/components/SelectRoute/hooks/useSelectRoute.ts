import { setRoutes } from '@/components/routes/redux'
import { Route } from '@/components/routes/types'
import { setVehicles } from '@/components/vehicles/redux'
import { Vehicle } from '@/components/vehicles/types'
import { firestore, auth } from '@/services/firebase'
import { RootState } from '@/store/store'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useSelectRouteProps } from '../types'
import { format } from 'date-fns'

const useSelectRoute = ({ setFields, setLocations, item }: useSelectRouteProps) => {
    const intl = useIntl()
    const allVehicles = useSelector((state: RootState) => state.vehicles)
    const allRoutes = useSelector((state: RootState) => state.routes)
    const dispatch = useDispatch()

    useEffect(() => {
        const qv = query(collection(firestore, 'vehicles'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeVehicles = onSnapshot(qv, (querySnapshot) => {
            const vehicles: Vehicle[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({key: doc.id, ...doc.data()})
            })
            dispatch(setVehicles(vehicles))
        })
        const qr = query(collection(firestore, 'routes'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeRoutes = onSnapshot(qr, (querySnapshot) => {
            const routes: Route[] = []
            querySnapshot.forEach((doc) => {
                routes.push({key: doc.id, ...doc.data()})
            })
            dispatch(setRoutes(routes))
        })
        return () => {
            unsubscribeVehicles()
            unsubscribeRoutes()
        } 
    }, [auth.currentUser?.uid])

    const allItems = useMemo(() => {
        return allRoutes.map((route) => ({
            key: route.key,
            name: route?.locations &&
            route.locations
                .map((location) => location.code)
                .join(' → ') ||
        '',
            locations: route.locations,
            vehicle: `${intl.formatMessage({
                id: `app.VehicleType.${allVehicles.find((vehicle) => vehicle.key === route.vehicleId)?.type}`,
            })} ${allVehicles.find((vehicle) => vehicle.key === route.vehicleId)?.name}`,
            vehicleId: route.vehicleId,
            date: `${route.startDate && format(new Date(route.startDate), 'dd.MM.yyyy HH:mm')} - ${route.endDate && format(new Date(route.endDate), 'dd.MM.yyyy HH:mm')}`
        }))
    }, [allVehicles, allRoutes])

    const selectedItem = useMemo(() => {
        return allItems.find((i) => i.key === item)
    }, [item, allItems])

    useEffect(() => {
        setLocations(allItems.find((i) => i.key === item)?.locations || [])
    }, [item, allRoutes])

    return { allItems, setFields, item: selectedItem }
    
}

export default useSelectRoute