import { Registration as RegistrationComponent } from '@/components/registration/Registration'
import { useRouter } from 'next/router'

export default function Registration(): JSX.Element {
    const router = useRouter()
    const locale =
        router.isReady && router.query.locale && router.query.locale.length > 0
            ? router.query.locale[0]
            : 'en'
    return <RegistrationComponent locale={locale} />
}
