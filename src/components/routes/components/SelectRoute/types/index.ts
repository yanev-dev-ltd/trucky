import { Location } from '@/components/routes/types'

export type SelectRouteItem = {
    key?: string
    name: string
    vehicle: string
    vehicleId?: string
    date?: string
    locations?: Location[]
}

export type SelectRouteProps = {
    allItems: SelectRouteItem[]
    item?: SelectRouteItem
    setFields: (route: object) => void
}

export type useSelectRouteProps = {
    setFields: (route: object) => void
    setLocations: (locations: Location[]) => void
    item: string
}