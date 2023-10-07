import { FC, PropsWithChildren } from 'react'
import LogIn from './components/LogIn/LogIn'
import useAppAuthProvider from './hooks/useAppAuthProvider'
import { Box, CircularProgress } from '@mui/material'
import Layout from '@/components/hoc/Layout/Layout'
import sx from './styles/AppAuthProvider.sx'
import { useRouter } from 'next/router'

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

    if (user !== 'anonymous' && user !== 'loading') {
        return <Layout>{children}</Layout>
    }

    return <LogIn />
}

export default Authenticated
