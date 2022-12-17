import { Vehicle } from '../../../types'
export type EditVehicleProps = {
    vehicleId: string | undefined
    vehicle: Vehicle | undefined
    edit: string | undefined
}

export type Files = {
    filename: File
    progress: number
}[]

export type UploadProgress = Files | {
    filename: string
    path: string
    progress: number
}[]