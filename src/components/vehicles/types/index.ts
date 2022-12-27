export type Vehicles = Vehicle[]

export type Vehicle = {
    key: string
    driver?: string
    mileage?: number
    name?: string
    type?: keyof VehicleTypes
    fuel?: keyof FuelTypes
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

export enum VehicleTypes {
    BULLDOZER = 'Bulldozer',
    BUS = 'Bus',
    CAR = 'Car',
    CARAVAN = 'Caravan',
    CEMENT_MIXER = 'CementMixer',
    CRANE = 'Crane',
    DUMP_TRUCK = 'DumpTruck',
    EXCAVATOR = 'Excavator',
    FORKLIFT = 'Forklift',
    LIGHT_DUTY_TRUCK = 'LightDutyTruck',
    PICKUP_TRUCK = 'PickupTruck',
    ROAD_TRACTOR = 'RoadTractor',
    SEMITRAILER = 'Semitrailer',
    TRACTOR = 'Tractor',
    TRAILER = 'Trailer',
    TRUCK = 'Truck',
    VAN = 'Van',
}

export enum FuelTypes {
    GASOLINE = 'Gasoline',
    DIESEL = 'Diesel',
    NATURAL_GAS = 'NaturalGas',
    METHANOL = 'Methanol',
    METHANE = 'Methane',
    KEROSINE = 'Kerosine',
    HYDROGEN = 'Hydrogen',
    HYBRID = 'Hybrid',
    ELECTRIC = 'Electric'
}