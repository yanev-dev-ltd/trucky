export type Maintenance = {
    cost?: number | string | null
    date?: number | null
    drivers?: string[]
    mileage?: number | null
    place?: string
    reminderDate?: number | null
    reminderMileage?: number | null
    type?: string
    part?: string
    key?: string
    vehicleId?: string
    userId?: string
}

export type Maintenances = Maintenance[]