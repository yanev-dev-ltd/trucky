import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { setDrivers } from '../redux'
import { DriversProps, useDriversProps, Driver } from '../types'
import useDriversFuse from './useDrivers.fuse'
import useDriversColumns from './useDrivers.columns'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const useDrivers = ({ driverId, edit }: useDriversProps): DriversProps => {
    const drivers = useSelector((state: RootState) => state.drivers)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useDriversColumns(drivers)
    const { fuse } = useDriversFuse(drivers)
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'drivers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const d: Driver[] = []
            querySnapshot.forEach((doc) => {
                d.push({...doc.data() as Driver, key: doc.id})
            })
            dispatch(setDrivers(d))
        })
        return () => unsubscribe()
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

    return { drivers, driverId, searchRef, fuse, columns, edit }
}

export default useDrivers