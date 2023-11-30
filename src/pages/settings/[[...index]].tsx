import { Settings as SettingsComponent } from '@/components/settings/Settings'
import { useRouter } from 'next/router'

export default function Settings(): JSX.Element {
    const router = useRouter()
    const section =
        router.isReady && router.query.index && router.query.index.length > 0
            ? router.query.index[0]
            : undefined
    return <SettingsComponent section={section} />
}
