import { Vehicles as VehiclesComponent } from '../../components/vehicles/Vehicles'
import { useRouter } from 'next/router'

export default function Vehicles(): JSX.Element {
    const router = useRouter()
    const vehicleId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    const edit =
        router.isReady && router.query.index && router.query.index.length > 1
            ? router.query.index[1]
            : undefined
    const routeId =
        router.isReady && router.query.index && router.query.index.length > 2
            ? router.query.index[2]
            : undefined
    return (
        <VehiclesComponent
            vehicleId={vehicleId}
            edit={edit}
            routeId={routeId}
        />
    )
}
