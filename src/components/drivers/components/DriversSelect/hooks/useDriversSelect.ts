import { useDriversSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { setDrivers as setDriversRedux } from '@/components/drivers/redux'
import { Driver } from '@/components/drivers/types'

const useDriversSelect = ({ drivers, setDrivers, sx, multiple }: useDriversSelectProps) => {
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'drivers'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const drivers: Driver[] = []
            querySnapshot.forEach((doc) => {
                drivers.push({...doc.data() as Driver, key: doc.id})
            })
            dispatch(setDriversRedux(drivers))
        })
        return () => unsubscribe()
    }, [auth.currentUser?.uid])

    const selectedValue = useMemo(() => {
        if (drivers && multiple) {
            return allDrivers.filter((d) => drivers.includes(d.key)) || []
        }
        if (drivers && !multiple) return allDrivers.find((d) => d.key === drivers[0])
    }, [drivers, allDrivers, multiple])
    return { drivers: selectedValue, setDrivers, allDrivers, sx, multiple }
}

export default useDriversSelect