import { Location } from '@/components/routes/types'
export type Order = {
    key?: string
    startStop?: Location
    endStop?: Location
    reference?: string
    weight?: number
    type?: string
    notes?: string
    vehicleId?: string
    routeId?: string
    userId?: string
    shouldDelete?: boolean
    clients?: string[]
}