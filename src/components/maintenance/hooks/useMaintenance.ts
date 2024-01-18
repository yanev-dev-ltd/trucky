import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { setMaintenances } from '../redux'
import { MaintenanceProps, useMaintenanceProps, Maintenance } from '../types'
import useMaintenanceFuse from './useMaintenance.fuse'
import useMaintenanceColumns from './useMaintenance.columns'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { Vehicle } from '@/components/vehicles/types'
import { setVehicles } from '@/components/vehicles/redux'
import { Trailer } from '@/components/trailers/types'
import { setTrailers } from '@/components/trailers/redux'

const useMaintenance = ({ maintenanceId, edit }: useMaintenanceProps): MaintenanceProps => {
    const maintenances = useSelector((state: RootState) => state.maintenances)
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const trailers = useSelector((state: RootState) => state.trailers)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useMaintenanceColumns(maintenances, vehicles, trailers)
    const { fuse } = useMaintenanceFuse(maintenances, vehicles)
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'maintenances'), where('userId', '==', auth.currentUser?.uid), orderBy('date', 'desc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const m: Maintenance[] = []
            querySnapshot.forEach((doc) => {
                m.push({...doc.data() as Maintenance, key: doc.id})
            })
            dispatch(setMaintenances(m))
        })
        const q2 = query(collection(firestore, 'vehicles'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeVehicles = onSnapshot(q2, (querySnapshot) => {
            const vehicles: Vehicle[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({...doc.data() as Vehicle, key: doc.id})
            })
            dispatch(setVehicles(vehicles))
        })
        const q3 = query(collection(firestore, 'trailers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeTrailers = onSnapshot(q3, (querySnapshot) => {
            const trailers: Trailer[] = []
            querySnapshot.forEach((doc) => {
                trailers.push({...doc.data() as Trailer, key: doc.id})
            })
            dispatch(setTrailers(trailers))
        })
        return () => { 
            unsubscribe()
            unsubscribeVehicles()
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

    return { maintenances, maintenanceId, searchRef, fuse, columns, edit }
}

export default useMaintenance