import { Vehicle } from '../../../types'
import { Maintenances } from '@/components/maintenance/types'
import { Route } from '@/components/routes/types'
export type EditVehicleProps = {
    vehicle: Vehicle | undefined
    edit: string | undefined
    routeId: string | undefined
}

export type useEditVehicleResponse = {
    saveVehicleField: (field: keyof Vehicle) => void
    editedVehicle: Vehicle | undefined
    setEditedVehicle: (vehicle: Vehicle | undefined) => void
    reset: () => void
    deleteVehicle: () => void
    maintenances: Maintenances
    routes: Route[]
}