import { Vehicle } from '../../../types'
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