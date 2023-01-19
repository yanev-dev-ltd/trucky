import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import drivers from '../../../api/drivers'
import { Vehicle, VehicleTypes, FuelTypes, Vehicles } from '../types'

const useVehiclesFuse = (vehicles: Vehicles) => {
    const intl = useIntl()
    const fuse: Fuse<Vehicle> = new Fuse(vehicles, {
        keys: [
            'name',
            'mileage',
            'route',
            {
                name: 'driver',
                getFn: (d: Vehicle) =>
                    drivers.find((dr) => dr.id === d.driver)?.name +
                    ' ' +
                    drivers.find((dr) => dr.id === d.driver)?.phone,
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