import { MutableRefObject } from 'react'
export type useAddVehicleProps = {
    open: boolean
    handleClose: () => void
    handleAddVehicle: () => void
    setNewVehicleName: (name: string) => void
    addVehicle: () => void
    newVehicleName: string | undefined
    newVehicleLoading: boolean
}