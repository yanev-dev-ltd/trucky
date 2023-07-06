import { Clients as ClientsComponent } from '../../components/clients/Clients'
import { useRouter } from 'next/router'

export default function Clients(): JSX.Element {
    const router = useRouter()
    const clientId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    const edit =
        router.isReady && router.query.index && router.query.index.length > 1
            ? router.query.index[1]
            : undefined
    return <ClientsComponent clientId={clientId} edit={edit} />
}
