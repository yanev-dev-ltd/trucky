import { Routes as RoutesComponent } from '@/components/routes/Routes'
import { useRouter } from 'next/router'

export default function Routes(): JSX.Element {
    const router = useRouter()
    const routeId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    return <RoutesComponent routeId={routeId} />
}
