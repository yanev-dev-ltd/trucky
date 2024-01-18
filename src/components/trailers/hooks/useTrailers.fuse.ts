import Fuse from 'fuse.js'
import { useIntl } from 'react-intl'
import { Trailer, Trailers } from '../types'

const useTrailersFuse = (trailers: Trailers) => {
    const intl = useIntl()
    const fuse: Fuse<Trailer> = new Fuse(trailers, {
        keys: [
            'name',
            'mileage',
            {
                name: 'type',
                getFn: (t: Trailer) =>
                    t.type
                        ? intl.formatMessage({
                              id: `app.TrailerType.${t.type}`,
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

export default useTrailersFuse