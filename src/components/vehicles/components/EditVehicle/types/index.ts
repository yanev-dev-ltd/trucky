import { Vehicle, Maintenance, Maintenances } from '../../../types'
import { UploadedFile } from '@/components/common/Upload/types'
import { Route } from '../../../../routes/types'
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
    downloadFile: (f: UploadedFile) => void
    deleteFile: (f: UploadedFile, dbpath: string, dbkey: string, files: UploadedFile[]) => void
    deleteVehicle: () => void
    addMaintenance: (m: Maintenance) => void
    maintenance: Maintenances
    routes: Route[]
    files: UploadedFile[]
}