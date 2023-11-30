import { Maintenance } from '@/components/maintenance/types'

export type AddMaintenanceProps = {
    addMaintenance: (m: Maintenance) => void
    units?: string
    vehicleId?: string
    setField: (field: string, value: string | number | null | string[]) => void
    maintenance: Maintenance
    reset: () => void
    fullButton?: boolean
}

export type useAddMaintenanceProps = {
    drivers?: string[]
    vehicleId?: string
    units?: string
    fullButton?: boolean
}