import { useEffect, useState, useRef, useCallback } from 'react'
import { Order, useOrdersProps } from '../types'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import useOrdersFuse from './useOrders.fuse'
import { firestore, auth } from '@/services/firebase'
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { setOrders } from '../redux'
import { Vehicle } from '@/components/vehicles/types'
import { setVehicles } from '@/components/vehicles/redux'
import useOrdersColumns from './useOrders.columns'
import { Location } from '@/components/routes/types'

const useOrders = ({ orderId }: useOrdersProps) => {
    const orders = useSelector((state: RootState) => state.orders)
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const [locations, setLocations] = useState<Location[]>([])
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useOrdersColumns(orders)
    const { fuse } = useOrdersFuse(orders)
    const router = useRouter()

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const conditions = [where('userId', '==', auth.currentUser?.uid)]
        router.query.group && conditions.push(where('groups', 'array-contains', router.query.group))
        const q = query(
            collection(firestore, 'orders'),
            ...conditions
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const orders: Order[] = []
            querySnapshot.forEach((doc) => {
                orders.push({...doc.data() as Order, key: doc.id})
            })
            dispatch(setOrders(orders))
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
        return () => {
            unsubscribe()
            unsubscribeVehicles()
        } 
    }, [auth.currentUser?.uid, router.query.group])

    useEffect(() => {
        if (!orderId || !auth.currentUser?.uid) {
            setLocations([])
            return
        }
        const getLocations = async () => {
            const order = orders.find(o => o.key === orderId)
            const docRef = doc(firestore, "routes", order?.routeId || '');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLocations(docSnap.data()?.locations)
            } else {
                setLocations([])
            }
        }
        getLocations()
    }, [orderId, orders])

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

    return { orderId, searchRef, fuse, columns, router, vehicles, orders, locations }
}

export default useOrders