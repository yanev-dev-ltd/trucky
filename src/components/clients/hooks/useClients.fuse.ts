import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import { Client } from '../types'

const useClientsFuse = (clients: Client[]) => {
    const intl = useIntl()
    const fuse: Fuse<Client> = new Fuse(clients, {
        keys: [
            'name',
            'phone',
            'address',
            'email',
            'contactPerson'
        ],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 3,
    })

    return { fuse }
}

export default useClientsFuse