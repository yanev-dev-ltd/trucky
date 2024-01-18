import Fuse from 'fuse.js'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Routes, Route } from '../types'
import { format } from 'date-fns'

const useRoutesFuse = (routes: Routes) => {
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const allVehicles = useSelector((state: RootState) => state.vehicles)
    const fuse: Fuse<Route> = new Fuse(routes, {
        keys: [
            {
                name: 'route',
                getFn: (r: Route) => (r?.locations &&
                    r.locations
                        .map((location) => location.code)
                        .join(' → ')) ||
                '-'
            },
            {
                name: 'startDate',
                getFn: (r: Route) => r.startDate
                ? format(new Date(r.startDate), 'dd.MM.yyyy HH:mm')
                : '-'
            },
            {
                name: 'endDate',
                getFn: (r: Route) => r.endDate
                ? format(new Date(r.endDate), 'dd.MM.yyyy HH:mm')
                : '-'
            },
            {
                name: 'vehicle',
                getFn: (r: Route) =>
                    allVehicles.find((vehicle) => vehicle.key === r.vehicleId)?.name || '-'
            },
            {
                name: 'drivers',
                getFn: (d: Route) =>
                d.drivers ? d.drivers.map((dId) => {
                        const dr = allDrivers.find((driver) => driver.key === dId)
                        return `${dr?.name} ${dr?.phone}`
                    }).join(', ') : '-'
            },
        ],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 3,
    })

    return { fuse }
}

export default useRoutesFuse