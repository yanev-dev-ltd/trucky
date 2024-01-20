import Fuse from 'fuse.js'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Order } from '../types'

const useOrdersFuse = (orders: Order[]) => {
    const allVehicles = useSelector((state: RootState) => state.vehicles)
    const fuse: Fuse<Order> = new Fuse(orders, {
        keys: [
            {
                name: 'startStop',
                getFn: (o: Order) => o.startStop?.code || '-'
            },
            {
                name: 'endStop',
                getFn: (o: Order) => o.endStop?.code || '-'
            },
            {
                name: 'vehicle',
                getFn: (o: Order) =>
                    allVehicles.find((vehicle) => vehicle.key === o.vehicleId)?.name || '-'
            }
        ],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 3,
    })

    return { fuse }
}

export default useOrdersFuse