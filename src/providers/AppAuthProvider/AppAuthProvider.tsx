import LogIn from './components/LogIn/LogIn'
import useAppAuthProvider from './hooks/useAppAuthProvider'
import { Box, CircularProgress } from '@mui/material'
import Layout from '../../components/hoc/Layout/Layout'
import sx from './styles/AppAuthProvider.sx'

const Authenticated: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
}) => {
    const { user, subscription } = useAppAuthProvider()

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

    if (
        user !== 'anonymous' &&
        user !== 'loading' &&
        subscription === 'active'
    ) {
        return <Layout>{children}</Layout>
    }

    if (
        user !== 'anonymous' &&
        user !== 'loading' &&
        user !== '' &&
        subscription !== 'active' &&
        subscription !== ''
    ) {
        return <Box sx={sx.container}>Inactive</Box>
        //   return (
        //     <Elements stripe={stripePromise}>
        //       <Box p={1}>
        //         <Typography color='error'><FormattedMessage id={`app.stripe.${subscription}`} /></Typography>
        //         <CheckoutForm />
        //       </Box>
        //     </Elements>)
    }
    return <LogIn />
}

export default Authenticated
