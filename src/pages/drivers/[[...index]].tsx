import { Drivers as DriversComponent } from '../../components/drivers/Drivers'
import { useRouter } from 'next/router'

export default function Drivers(): JSX.Element {
    const router = useRouter()
    const driverId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    return <DriversComponent driverId={driverId} />
}
