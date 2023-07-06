import { useClientsSelectProps } from '../types'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

const useClientsSelect = ({ clients, setClients, sx }: useClientsSelectProps) => {
    const allClients = useSelector((state: RootState) => state.clients)
    return { clients, setClients, allClients, sx }
}

export default useClientsSelect