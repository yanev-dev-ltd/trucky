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

const useVehicles =  ({ vehicleId, edit, routeId }:useVehicleProps): VehicleProps => {
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const drivers = useSelector((state: RootState) => state.drivers)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useVehiclesColumns(vehicles)
    const { fuse } = useVehiclesFuse(vehicles)
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'vehicles'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vehicles: Vehicle[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({key: doc.id, ...doc.data()})
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
            unsubscribeDrivers()
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

    return { vehicles, vehicleId, edit, searchRef, fuse, columns, routeId, drivers }
}

export default useVehicles