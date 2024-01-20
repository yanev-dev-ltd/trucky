import { SelectItem, useSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { setTrailers } from '@/components/trailers/redux'
import { setVehicles } from '@/components/vehicles/redux'
import { setDrivers } from '@/components/drivers/redux'
import { setClients } from '@/components/clients/redux'
import { AddTrailer } from '@/components/trailers/components/AddTrailer/AddTrailer'
import { AddVehicle } from '@/components/vehicles/components/AddVehicle/AddVehicle'
import { AddDriver } from '@/components/drivers/components/AddDriver/AddDriver'
import { AddClient } from '@/components/clients/components/AddClient/AddClient'

const useSelect = ({ items, setItems, sx, multiple, type }: useSelectProps) => {
    const allItems = useSelector((state: RootState) => state[type] as SelectItem[])
    const dispatch = useDispatch()

    const setRedux = useMemo(() => {
        switch (type) {
            case 'trailers':
                return setTrailers
            case 'vehicles':
                return setVehicles
            case 'drivers':
                return setDrivers
            case 'clients':
                return setClients
        }
    }, [type])

    const AddItem = useMemo(() => {
        switch (type) {
            case 'trailers':
                return AddTrailer
            case 'vehicles':
                return AddVehicle
            case 'drivers':
                return AddDriver
            case 'clients':
                return AddClient
        }
    }, [type])

    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, type), where('userId', '==', auth.currentUser?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items: SelectItem[] = []
            querySnapshot.forEach((doc) => {
                items.push({...doc.data() as SelectItem, key: doc.id})
            })
            dispatch(setRedux(items))
        })
        return () => unsubscribe()
    }, [auth.currentUser?.uid])

    const selectedValue = useMemo(() => {
        if (items && multiple) {
            return Array.isArray(allItems) && allItems.filter((i: SelectItem) => items.includes(i?.key))
        }
        if (items && !multiple) {
            const item = allItems.find((i: SelectItem) => i?.key === items[0])
            return item ? item : undefined
        }
        return []
    }, [items, allItems, multiple])
    return { items: selectedValue || [], setItems, allItems, sx, multiple, type, AddItem }
}

export default useSelect