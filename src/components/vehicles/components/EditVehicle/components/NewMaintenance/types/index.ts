import { Maintenance } from '@/components/maintenance/types'
import { Driver } from '@/components/drivers/types'
export type NewMaintenanceProps = {
    addMaintenance: (m: Maintenance) => void
    drivers: string[]
    units?: string
}