import { MutableRefObject } from 'react'
export type useAddVehicleProps = {
    open: boolean
    handleClose: () => void
    handleAddVehicle: () => void
    changeField: (field: string, value: string) => void
    addVehicle: () => void
    newVehicle: NewVehicle | undefined
    newVehicleLoading: boolean
}
export type NewVehicle = {
    name?: string
    type?: string
    fuel?: string
    units?: string
    userId?: string
}