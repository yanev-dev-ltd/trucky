import { Vehicle } from '@/components/vehicles/types'
import { useVehiclesSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { setVehicles as setVehiclesRedux } from '@/components/vehicles/redux'

const useVehiclesSelect = ({ vehicles, setVehicles, sx, multiple }: useVehiclesSelectProps) => {
    const allVehicles = useSelector((state: RootState) => state.vehicles)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'vehicles'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vehicles: Vehicle[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({...doc.data() as Vehicle, key: doc.id})
            })
            dispatch(setVehiclesRedux(vehicles))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])

    const selectedValue = useMemo(() => {
        if (vehicles && multiple) {
            return allVehicles.filter((v: Vehicle) => vehicles.includes(v.key)) || []
        }
        return vehicles && allVehicles.find((v: Vehicle) => v.key === vehicles[0])
    }, [vehicles, allVehicles, multiple])

    return { vehicles: selectedValue, setVehicles, allVehicles, sx, multiple }
}

export default useVehiclesSelect