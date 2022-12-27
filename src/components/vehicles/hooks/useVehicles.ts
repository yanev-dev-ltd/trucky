import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue, push } from 'firebase/database'
import { RootState } from '../../../store/store'
import { db, auth } from '../../../services/firebase'
import { setVehicles } from '../redux'
import { snapshotToArray } from '../../../utils/globalUtils'
import { VehicleProps, useVehicleProps } from '../types'

const useVehicles =  ({ vehicleId, edit }:useVehicleProps): VehicleProps => {
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    
    useEffect(() => {
        if (user === 'loading' || user === 'anonymous') {
            return
        }
        const unsubscribe = onValue(ref(db, 'vehicles/' + user), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setVehicles(snp ? snapshotToArray(snp) : []))
        })
        return () => unsubscribe()
    }, [user])

    return { vehicles, vehicleId, edit }
}

export default useVehicles