import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import allDrivers from '@/api/drivers'
import { Vehicle, VehicleTypes, FuelTypes, Vehicles } from '../types'

const useVehiclesFuse = (vehicles: Vehicles) => {
    const intl = useIntl()
    const fuse: Fuse<Vehicle> = new Fuse(vehicles, {
        keys: [
            'name',
            'mileage',
            'route',
            {
                name: 'drivers',
                getFn: (d: Vehicle) =>
                d.drivers ? d.drivers.map((dId) => {
                        const dr = allDrivers.find((driver) => driver.id === dId)
                        return `${dr?.name} ${dr?.phone}`
                    }).join(', ') : '-'
            },
            {
                name: 'type',
                getFn: (t: Vehicle) =>
                    t.type
                        ? intl.formatMessage({
                              id: `app.VehicleType.${
                                  VehicleTypes[
                                      t.type as keyof typeof VehicleTypes
                                  ]
                              }`,
                          })
                        : '-',
            },
            {
                name: 'fuel',
                getFn: (t: Vehicle) =>
                    t.fuel
                        ? intl.formatMessage({
                              id: `app.FuelType.${
                                  FuelTypes[
                                      t.fuel as keyof typeof FuelTypes
                                  ]
                              }`,
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