import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useClientsSelect from './hooks/useClientsSelect'
import ClientsSelectView from './views/ClientsSelectView'
import { useClientsSelectProps } from './types'

export const ClientsSelect: FC<useClientsSelectProps> = wrap(
    ClientsSelectView,
    useClientsSelect
)
