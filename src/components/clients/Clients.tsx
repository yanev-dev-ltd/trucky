import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useClients from './hooks/useClients'
import ClientsView from './views/ClientsView'
import { useClientsProps } from './types'

export const Clients: FC<useClientsProps> = wrap(ClientsView, useClients)
