import { Client } from '@/components/clients/types'
import { SxProps, Theme } from '@mui/material'

export type useClientsSelectProps = {
    clients?: string[],
    setClients: (client: string[]) => void,
    sx?: SxProps<Theme>
}

export type ClientsSelectProps = {
    clients?: string[],
    setClients: (client: string[]) => void,
    allClients: Client[],
    sx?: SxProps<Theme>
}