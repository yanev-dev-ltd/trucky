import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import { Maintenance } from '../types'
import { Vehicle } from '@/components/vehicles/types'

const useMaintenanceFuse = (maintenance: Maintenance[], vehicles: Vehicle[]) => {
    const intl = useIntl()
    const fuse: Fuse<Maintenance> = new Fuse(maintenance, {
        keys: [
            'type',
            'description',
            {
                name: 'vehicle',
                getFn: (m: Maintenance) =>
                m.vehicleId ? vehicles.find((v) => v.key === m.vehicleId)?.name || '' : '-'
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

export default useMaintenanceFuse