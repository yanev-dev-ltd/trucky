import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import { Driver } from '../types'

const useDriversFuse = (drivers: Driver[]) => {
    const intl = useIntl()
    const fuse: Fuse<Driver> = new Fuse(drivers, {
        keys: [
            'name',
            'phone',
            'address',
        ],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 3,
    })

    return { fuse }
}

export default useDriversFuse