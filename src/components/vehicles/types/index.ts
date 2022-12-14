export type Vehicles = Vehicle[]

export type Vehicle = {
    key: string
    driver?: string
    mileage?: number
    name?: string
    type?: number
    units?: string
    route?: string
}

export type useVehicleProps = {
    vehicleId: string | undefined
    edit: string | undefined
}

export type VehicleProps = {
    vehicleId: string | undefined
    vehicles: Vehicles,
    edit: string | undefined
}