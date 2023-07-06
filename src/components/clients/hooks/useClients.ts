import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, onValue } from 'firebase/database'
import { RootState } from '@/store/store'
import { db, auth } from '@/services/firebase'
import { setClients } from '../redux'
import { snapshotToArray } from '@/utils/globalUtils'
import { ClientsProps, useClientsProps } from '../types'
import useClientsFuse from './useClients.fuse'
import useClientsColumns from './useClients.columns'

const useClients = ({ clientId, edit }: useClientsProps): ClientsProps => {
    const clients = useSelector((state: RootState) => state.clients)
    const dispatch = useDispatch()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { columns } = useClientsColumns(clients)
    const { fuse } = useClientsFuse(clients)
    
    useEffect(() => {
        if (!auth.currentUser?.uid) {
            return
        }
        const unsubscribe = onValue(ref(db, 'clients/' + auth.currentUser?.uid), (snapshot) => {
            const snp = snapshot.val()
            dispatch(setClients(snp ? snapshotToArray(snp) : []))
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

    return { clients, clientId, searchRef, fuse, columns, edit }
}

export default useClients