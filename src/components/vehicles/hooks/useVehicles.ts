import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '../../../store/store'
import { db, auth } from '../../../services/firebase'
import { setVehicles } from '../redux'
import { snapshotToArray } from '../../../utils/globalUtils'
import { VehicleProps, useVehicleProps } from '../types'
import useVehiclesColumns from './useVehicles.columns'
import useVehiclesFuse from './useVehicles.fuse'

const useVehicles =  ({ vehicleId, edit }:useVehicleProps): VehicleProps => {
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useVehiclesColumns(vehicles)
    const { fuse } = useVehiclesFuse(vehicles)
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onValue(ref(db, 'vehicles/' + auth.currentUser?.uid), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setVehicles(snp ? snapshotToArray(snp) : []))
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

    return { vehicles, vehicleId, edit, searchRef, fuse, columns }
}

export default useVehicles