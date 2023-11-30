import { Maintenance as MaintenanceComponent } from '@/components/maintenance/Maintenance'
import { useRouter } from 'next/router'

export default function Maintenance(): JSX.Element {
    const router = useRouter()
    const maintenanceId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    const edit =
        router.isReady && router.query.index && router.query.index.length > 1
            ? router.query.index[1]
            : undefined
    return <MaintenanceComponent maintenanceId={maintenanceId} edit={edit} />
}
