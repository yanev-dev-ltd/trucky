import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { firestore, auth } from '@/services/firebase'
import { ClientsProps, useClientsProps, Client } from '../types'
import { setClients } from '../redux'
import useClientsFuse from './useClients.fuse'
import useClientsColumns from './useClients.columns'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

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
        const q = query(collection(firestore, 'clients'), where('userId', '==', auth.currentUser?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const clients: Client[] = []
            querySnapshot.forEach((doc) => {
                clients.push({key: doc.id, ...doc.data()})
            })
            dispatch(setClients(clients))
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