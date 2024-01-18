import { useEffect, useRef } from 'react'
import { Route, useRoutesProps } from '../types'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import useRoutesColumns from './useRoutes.columns'
import { useRouter } from 'next/router'
import useRoutesFuse from './useRoutes.fuse'
import { firestore, auth } from '@/services/firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { Vehicle } from '@/components/vehicles/types'
import { setVehicles } from '@/components/vehicles/redux'
import { Driver } from '@/components/drivers/types'
import { setDrivers } from '@/components/drivers/redux'
import { setRoutes } from '../redux'

const useRoute = ({ routeId }: useRoutesProps) => {
    const routes = useSelector((state: RootState) => state.routes)
    const drivers = useSelector((state: RootState) => state.drivers)
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useRoutesColumns(routes)
    const { fuse } = useRoutesFuse(routes)
    const router = useRouter()

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const conditions = [where('userId', '==', auth.currentUser?.uid)]
        router.query.group && conditions.push(where('groups', 'array-contains', router.query.group))
        const q = query(
            collection(firestore, 'routes'),
            ...conditions,
            orderBy('startDate', 'desc')
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const routes: Route[] = []
            querySnapshot.forEach((doc) => {
                routes.push({...doc.data() as Route, key: doc.id})
            })
            dispatch(setRoutes(routes))
        })
        const qv = query(
            collection(firestore, 'vehicles'),
            where('userId', '==', auth.currentUser?.uid)
        )
        const unsubscribeVehicles = onSnapshot(qv, (querySnapshot) => {
            const vehicles: Vehicle[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({...doc.data() as Vehicle, key: doc.id})
            })
            dispatch(setVehicles(vehicles))
        })
        const qd = query(collection(firestore, 'drivers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeDrivers = onSnapshot(qd, (querySnapshot) => {
            const drivers: Driver[] = []
            querySnapshot.forEach((doc) => {
                drivers.push({key: doc.id, ...doc.data()})
            })
            dispatch(setDrivers(drivers))
        })
        return () => {
            unsubscribe()
            unsubscribeVehicles()
            unsubscribeDrivers()
        } 
    }, [auth.currentUser?.uid, router.query.group])

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === '/' && (event.target as HTMLElement)?.tagName.toUpperCase() !== 'INPUT' && (event.target as HTMLElement)?.tagName.toUpperCase() !== 'TEXTAREA') {
                event.preventDefault()
                searchRef.current?.focus()
            }
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [])

    return { routeId, routes, dispatch, searchRef, columns, fuse, drivers, vehicles, router }
}

export default useRoute