import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '@/store/store'
import { db, auth } from '@/services/firebase'
import { setDrivers } from '../redux'
import { snapshotToArray } from '@/utils/globalUtils'
import { DriversProps, useDriversProps } from '../types'
import useDriversFuse from './useDrivers.fuse'
import useDriversColumns from './useDrivers.columns'

const useDrivers = ({ driverId }: useDriversProps): DriversProps => {
    const drivers = useSelector((state: RootState) => state.drivers)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useDriversColumns(drivers)
    const { fuse } = useDriversFuse(drivers)
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onValue(ref(db, 'drivers/' + auth.currentUser?.uid), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setDrivers(snp ? snapshotToArray(snp) : []))
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

    return { drivers, driverId, searchRef, fuse, columns }
}

export default useDrivers