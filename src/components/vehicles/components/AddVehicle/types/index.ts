export type useAddVehicleProps = {
    onSave: (driverId: string) => void
    setOpen: (open: boolean) => void
    open: boolean
    changeField?: (field: string, value: string) => void
    newVehicle?: NewVehicle | undefined
    newVehicleLoading?: boolean
    redirectToEdit?: boolean
}
export type AddVehicleProps = {
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