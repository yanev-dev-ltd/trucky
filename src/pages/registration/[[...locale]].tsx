import { Registration as RegistrationComponent } from '@/components/registration/Registration'
import { useRouter } from 'next/router'
import { Locales } from '../../types/settings'

export default function Registration(): JSX.Element {
    const router = useRouter()
    const locale =
        router.isReady && router.query.locale && router.query.locale.length > 0
            ? Object.values(Locales).includes(router.query.locale[0] as Locales)
                ? (router.query.locale[0] as Locales)
                : Locales.en
            : Locales.en
    return <RegistrationComponent locale={locale} />
}
