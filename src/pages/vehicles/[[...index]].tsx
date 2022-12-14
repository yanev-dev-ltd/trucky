import { Box } from '@mui/material'
import { Vehicles as VehiclesComponent } from '../../components/vehicles/Vehicles'
import { useRouter } from 'next/router'

export default function Vehicles(): JSX.Element {
    const router = useRouter()
    const vehicleId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    const edit =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[1]
            : undefined
    return <VehiclesComponent vehicleId={vehicleId} edit={edit} />
}
