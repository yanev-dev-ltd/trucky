import { VehicleTypes, FuelTypes } from '@/components/vehicles/types'

export type useAddVehicleProps = {
    onSave: (driverId: string) => void
    setOpen: (open: boolean | string) => void
    open: boolean | string
    changeField?: (field: keyof NewVehicle, value: string) => void
    newVehicle?: NewVehicle | undefined
    newVehicleLoading?: boolean
    redirectToEdit?: boolean
}
export type AddVehicleProps = {
    open: boolean | string
    handleClose: () => void
    handleAddVehicle: () => void
    changeField: (field: keyof NewVehicle, value: string) => void
    addVehicle: () => void
    newVehicle: NewVehicle | undefined
    newVehicleLoading: boolean
}
export type NewVehicle = {
    name?: string
    type?: VehicleTypes
    fuel?: FuelTypes
    units?: string
    userId?: string
    trailerId?: string | null
}