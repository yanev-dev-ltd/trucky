import { Maintenance } from '@/components/maintenance/types'

export type NewMaintenanceProps = {
    addMaintenance: (m: Maintenance) => void
    drivers: string[]
    units?: string
}