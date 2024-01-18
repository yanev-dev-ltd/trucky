import { Trailers as TrailersComponent } from '@/components/trailers/Trailers'
import { useRouter } from 'next/router'

export default function Trailers(): JSX.Element {
    const router = useRouter()
    const trailerId =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    const edit =
        router.isReady && router.query.index && router.query.index.length > 1
            ? router.query.index[1]
            : undefined
    return <TrailersComponent trailerId={trailerId} edit={edit} />
}
