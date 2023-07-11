import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { useClientsSelectProps } from '../types'
import { RootState } from '@/store/store'
import { db, auth } from '@/services/firebase'
import { setClients as setClientsRedux } from '@/components/clients/redux'
import { snapshotToArray } from '@/utils/globalUtils'

const useClientsSelect = ({ clients, setClients, sx }: useClientsSelectProps) => {
    const allClients = useSelector((state: RootState) => state.clients)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onValue(ref(db, 'clients/' + auth.currentUser?.uid), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setClientsRedux(snp ? snapshotToArray(snp) : []))
        })
        return () => {
            unsubscribe()
        } 
    }, [auth.currentUser?.uid])
    return { clients, setClients, allClients, sx }
}

export default useClientsSelect