import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '../../../store/store'
import { db, auth } from '../../../services/firebase'
import { setVehicles } from '../redux'
import { snapshotToArray } from '../../../utils/globalUtils'
import { VehicleProps, useVehicleProps } from '../types'

const useVehicles =  ({ vehicleId, edit }:useVehicleProps): VehicleProps => {
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const dispatch = useDispatch()
    
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

    return { vehicles, vehicleId, edit }
}

export default useVehicles