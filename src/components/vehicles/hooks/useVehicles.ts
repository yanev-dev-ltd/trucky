import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { setVehicles } from '../redux'
import { setDrivers } from '../../drivers/redux'
import { VehicleProps, useVehicleProps, Vehicle } from '../types'
import useVehiclesColumns from './useVehicles.columns'
import useVehiclesFuse from './useVehicles.fuse'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { Driver } from '@/components/drivers/types'
import { useRouter } from 'next/router'
import { Trailer } from '@/components/trailers/types'
import { setTrailers } from '@/components/trailers/redux'

const useVehicles =  ({ vehicleId, edit, routeId }:useVehicleProps): VehicleProps => {
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const drivers = useSelector((state: RootState) => state.drivers)
    const trailers = useSelector((state: RootState) => state.trailers)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useVehiclesColumns(vehicles)
    const { fuse } = useVehiclesFuse(vehicles)
    const router = useRouter()
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const conditions = [where('userId', '==', auth.currentUser?.uid)]
        router.query.group && conditions.push(where('groups', 'array-contains', router.query.group))
        const q = query(
            collection(firestore, 'vehicles'),
            ...conditions
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vehicles: Vehicle[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({...doc.data() as Vehicle, key: doc.id})
            })
            dispatch(setVehicles(vehicles))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid, router.query.group])

    useEffect(() => {
        const qd = query(collection(firestore, 'drivers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeDrivers = onSnapshot(qd, (querySnapshot) => {
            const drivers: Driver[] = []
            querySnapshot.forEach((doc) => {
                drivers.push({key: doc.id, ...doc.data()})
            })
            dispatch(setDrivers(drivers))
        })
        const qt = query(collection(firestore, 'trailers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeTrailers = onSnapshot(qt, (querySnapshot) => {
            const trailers: Trailer[] = []
            querySnapshot.forEach((doc) => {
                trailers.push({key: doc.id, ...doc.data()})
            })
            dispatch(setTrailers(trailers))
        })
        return () => {
            unsubscribeDrivers()
            unsubscribeTrailers()
        } 
    }, [auth.currentUser?.uid])

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

    return { vehicles, vehicleId, edit, searchRef, fuse, columns, routeId, drivers, trailers }
}

export default useVehicles