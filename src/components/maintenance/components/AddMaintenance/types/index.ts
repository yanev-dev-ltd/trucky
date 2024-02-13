import { Maintenance } from '@/components/maintenance/types'
import { SyntheticEvent } from 'react'

export type AddMaintenanceProps = {
    units: string
    vehicleId?: string
    setField: (field: string, value: string | number | null | string[]) => void
    maintenance: Maintenance
    fullButton?: boolean
    handleOpen: () => void
    handleClose: (deleteMaintenance: boolean) => void
    handleSubmit: (event: SyntheticEvent) => void
    newMaintenanceOpen: string | false
    isTrailer?: boolean
    currency?: string
}

export type useAddMaintenanceProps = {
    drivers?: string[]
    vehicleId?: string
    units: string
    fullButton?: boolean
    isTrailer?: boolean
}