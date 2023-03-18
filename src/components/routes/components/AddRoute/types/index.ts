import { Driver } from '@/components/drivers/types'
export type AddRouteProps = {
    vehicleId: string
}

export type Route = {
    [x: string]: string | Driver[]
}