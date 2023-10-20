import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useClientsSelectProps } from '../types'
import { Client } from '@/components/clients/types'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { setClients as setClientsRedux } from '@/components/clients/redux'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const useClientsSelect = ({ clients, setClients, sx }: useClientsSelectProps) => {
    const allClients = useSelector((state: RootState) => state.clients)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const q = query(collection(firestore, 'clients'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vehicles: Client[] = []
            querySnapshot.forEach((doc) => {
                vehicles.push({key: doc.id, ...doc.data()})
            })
            dispatch(setClientsRedux(vehicles))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])
    return { clients, setClients, allClients, sx }
}

export default useClientsSelect