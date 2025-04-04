import type { AppType } from 'next/app'
import AppUiProviders from '../providers/AppUiProviders/AppUiProviders'
import AppAuthProvider from '../providers/AppAuthProvider/AppAuthProvider'
import AppReduxProvider from '../providers/AppReduxProvider/AppReduxProvider'
import Script from 'next/script'

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <Script
                strategy="beforeInteractive"
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.TRUCKY_GOOGLE_MEPS_API_KEY}&libraries=places`}
            />
            <Script strategy="beforeInteractive">{`window.global = window`}</Script>
            <AppReduxProvider>
                <AppUiProviders>
                    <AppAuthProvider>
                        <Component {...pageProps} />
                    </AppAuthProvider>
                </AppUiProviders>
            </AppReduxProvider>
        </>
    )
}

export default MyApp
