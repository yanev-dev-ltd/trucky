import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { DocumentsProps, useDocumentsProps } from '../types'
import { setDocuments } from '../redux'
import useDocumentsFuse from './useDocuments.fuse'
import useDocumentsColumns from './useDocuments.columns'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { Document } from '@/components/common/Documents/types'
import { Vehicle } from '@/components/vehicles/types'
import { setVehicles } from '@/components/vehicles/redux'
import { Trailer } from '@/components/trailers/types'
import { setTrailers } from '@/components/trailers/redux'
import { Driver } from '@/components/drivers/types'
import { setDrivers } from '@/components/drivers/redux'
import { Maintenance } from '@/components/maintenance/types'
import { setMaintenances } from '@/components/maintenance/redux'
import { Client } from '@/components/clients/types'
import { setClients } from '@/components/clients/redux'
import { Order } from '@/components/orders/types'
import { setOrders } from '@/components/orders/redux'

const useClients = ({ documentId, edit }: useDocumentsProps): DocumentsProps => {
    const documents = useSelector((state: RootState) => state.documents)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useDocumentsColumns(documents)
    const { fuse } = useDocumentsFuse(documents)
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const conditions = [where('userId', '==', auth.currentUser?.uid), orderBy('date', 'desc')]
        const q = query(collection(firestore, 'documents'), ...conditions)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const documents: Document[] = []
            querySnapshot.forEach((doc) => {
                documents.push({key: doc.id, ...doc.data()})
            })
            dispatch(setDocuments(documents))
        })
        const qv = query(collection(firestore, 'vehicles'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeVehicles = onSnapshot(qv, (querySnapshot) => {
            const vehicles: Vehicle[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({key: doc.id, ...doc.data()})
            })
            dispatch(setVehicles(vehicles))
        })
        const qt = query(collection(firestore, 'trailers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeTrailers = onSnapshot(qt, (querySnapshot) => {
            const trailers: Trailer[] = []
            querySnapshot.forEach((doc) => {
                trailers.push({key: doc.id, ...doc.data()})
            })
            dispatch(setTrailers(trailers))
        })
        const qd = query(collection(firestore, 'drivers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeDrivers = onSnapshot(qd, (querySnapshot) => {
            const drivers: Driver[] = []
            querySnapshot.forEach((doc) => {
                drivers.push({key: doc.id, ...doc.data()})
            })
            dispatch(setDrivers(drivers))
        })
        const qm = query(collection(firestore, 'maintenances'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeMaintenances = onSnapshot(qm, (querySnapshot) => {
            const maintenances: Maintenance[] = []
            querySnapshot.forEach((doc) => {
                maintenances.push({key: doc.id, units: doc.data().units, ...doc.data()})
            })
            dispatch(setMaintenances(maintenances))
        })
        const qc = query(collection(firestore, 'clients'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeClients = onSnapshot(qc, (querySnapshot) => {
            const clients: Client[] = []
            querySnapshot.forEach((doc) => {
                clients.push({key: doc.id, ...doc.data()})
            })
            dispatch(setClients(clients))
        })
        const qo = query(collection(firestore, 'orders'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribeOrders = onSnapshot(qo, (querySnapshot) => {
            const orders: Order[] = []
            querySnapshot.forEach((doc) => {
                orders.push({key: doc.id, ...doc.data()})
            })
            dispatch(setOrders(orders))
        })
        return () => {
            unsubscribe()
            unsubscribeVehicles()
            unsubscribeTrailers()
            unsubscribeDrivers()
            unsubscribeMaintenances()
            unsubscribeClients()
            unsubscribeOrders()
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

    return { documents, documentId, searchRef, fuse, columns, edit }
}

export default useClients