import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Vehicle, Vehicles } from '../types'

const useVehiclesFuse = (vehicles: Vehicles) => {
    const intl = useIntl()
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const allTrailers = useSelector((state: RootState) => state.trailers)
    const fuse: Fuse<Vehicle> = new Fuse(vehicles, {
        keys: [
            'name',
            'mileage',
            'route',
            {
                name: 'trailer',
                getFn: (v: Vehicle) =>
                    v.trailerId
                        ? `${allTrailers?.find((trailer) => trailer.key === v.trailerId)?.name} ${allTrailers?.find((trailer) => trailer.key === v.trailerId)?.type && intl.formatMessage({
                            id: `app.TrailerType.${allTrailers?.find((trailer) => trailer.key === v.trailerId)?.type}`,
                        })}` || '-'
                        : '-',
            },
            {
                name: 'drivers',
                getFn: (d: Vehicle) =>
                d.drivers ? d.drivers.map((dId) => {
                        const dr = allDrivers.find((driver) => driver.key === dId)
                        return `${dr?.name} ${dr?.phone}`
                    }).join(', ') : '-'
            },
            {
                name: 'type',
                getFn: (t: Vehicle) =>
                    t.type
                        ? intl.formatMessage({
                              id: `app.VehicleType.${t.type}`,
                          })
                        : '-',
            },
            {
                name: 'fuel',
                getFn: (t: Vehicle) =>
                    t.fuel
                        ? intl.formatMessage({
                              id: `app.FuelType.${t.fuel}`,
                          })
                        : '-',
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

export default useVehiclesFuse