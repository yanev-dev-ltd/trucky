export type Vehicles = Vehicle[]

export type Vehicle = {
    key: string
    driver?: string
    mileage?: number
    name?: string
    type?: number
    units?: string
    route?: string
    files?: VehicleFile[]
    services?: Service[]
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

export type Service = {
    cost: number
    date: number
    driver: string
    mileage: number
    place: string
    reminder: string
    type: number
}

export type VehicleFile = {
    name: string
    path: string
    url: string
    date: number
}