import { Vehicle, VehicleFile, Service, Services } from '../../../types'
export type EditVehicleProps = {
    vehicle: Vehicle | undefined
    edit: string | undefined
}

export type Files = {
    filename: File
    progress: number
    path? : string
}[]

export type UploadProgress = {
    filename: string
    path: string
    progress: number
}[]

export type useEditVehicleResponse = {
    saveVehicleField: (field: keyof Vehicle) => void
    editedVehicle: Vehicle | undefined
    setEditedVehicle: (vehicle: Vehicle | undefined) => void
    reset: () => void
    downloadFile: (f: VehicleFile) => void
    deleteUploadedFile: (f: VehicleFile) => void
    deleteVehicle: () => void
    addService: (s: Service) => void
    service: Services
}