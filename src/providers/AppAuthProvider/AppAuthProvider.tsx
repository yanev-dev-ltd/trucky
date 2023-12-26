import { FC, PropsWithChildren } from 'react'
import LogIn from './components/LogIn/LogIn'
import EmailVerification from './components/EmailVerification/EmailVerification'
import useAppAuthProvider from './hooks/useAppAuthProvider'
import { Box, CircularProgress } from '@mui/material'
import Layout from '@/components/hoc/Layout/Layout'
import sx from './styles/AppAuthProvider.sx'
import { useRouter } from 'next/router'
import { auth } from '@/services/firebase'

const Authenticated: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const { user, subscription } = useAppAuthProvider()
    const router = useRouter()
    if (
        user !== 'anonymous' &&
        user !== 'loading' &&
        user !== '' &&
        subscription !== 'active' &&
        subscription !== '' &&
        !router.asPath.startsWith('/settings')
    ) {
        router.push('/settings/invoices')
    }

    if (
        user === 'loading' ||
        subscription === 'loading' ||
        (subscription === '' && user !== 'anonymous')
    ) {
        return (
            <Box sx={sx.container}>
                <CircularProgress />
            </Box>
        )
    }

    if (router.asPath.startsWith('/registration') && user === 'anonymous') {
        return <>{children}</>
    }

    if (router.asPath.startsWith('/registration') && user !== 'anonymous') {
        router.push('/')
    }

    if (auth.currentUser?.emailVerified === false) {
        return <EmailVerification />
    }

    if (user !== 'anonymous' && user !== 'loading') {
        return <Layout>{children}</Layout>
    }

    return <LogIn />
}

export default Authenticated
