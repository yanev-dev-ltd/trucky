import Fuse from 'fuse.js'
import { Document } from '@/components/common/Documents/types'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'

const useDocumentsFuse = (documents: Document[]) => {
    const intl = useIntl()
    const vehicles = useSelector((state: RootState) => state.vehicles)
    const trailers = useSelector((state: RootState) => state.trailers)
    const drivers = useSelector((state: RootState) => state.drivers)
    const maintenances = useSelector((state: RootState) => state.maintenances)
    const clients = useSelector((state: RootState) => state.clients)
    const fuse: Fuse<Document> = new Fuse(documents, {
        keys: [
            'title',
            'name',
            {
                name: 'type',
                getFn: (d: Document) => {
                    let typeName = '-'
                    switch (d.type) {
                        case 'vehicle':
                            typeName =
                                vehicles.find((v) => v.key === d.typeId)
                                    ?.name || '-'
                            break
                        case 'trailer':
                            typeName =
                                trailers.find((t) => t.key === d.typeId)
                                    ?.name || '-'
                            break
                        case 'driver':
                            typeName =
                                drivers.find((dr) => dr.key === d.typeId)
                                    ?.name || '-'
                            break
                        case 'maintenance':
                            const maintenance = maintenances.find(
                                (m) => m.key === d.typeId
                            )
                            typeName =
                                `${maintenance?.type}, ${
                                    maintenance?.isTrailer
                                        ? intl.formatMessage({
                                              id: 'app.Trailer',
                                          })
                                        : intl.formatMessage({
                                              id: 'app.Vehicle',
                                          })
                                }: ${
                                    maintenance?.isTrailer
                                        ? trailers.find(
                                              (t) =>
                                                  t.key ===
                                                  maintenance.vehicleId
                                          )?.name || '-'
                                        : vehicles.find(
                                              (v) =>
                                                  v.key ===
                                                  maintenance?.vehicleId
                                          )?.name
                                }` || '-'
                            break
                        case 'client':
                            typeName =
                                clients.find((c) => c.key === d.typeId)?.name ||
                                '-'
                            break
                    }
                    return typeName
                }
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

export default useDocumentsFuse