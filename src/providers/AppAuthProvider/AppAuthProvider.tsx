import LogIn from './components/LogIn/LogIn'
import useAppAuthProvider from './hooks/useAppAuthProvider'
import { Box, CircularProgress} from '@mui/material'


const Authenticated: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const { user, subscription } = useAppAuthProvider()
  
    if (user === 'loading' || subscription === 'loading') {
      return (
        <Box display='flex' flexDirection='column' alignItems='center' mt={6}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (user !== 'anonymous' && subscription === 'active') {
      return (
        <>
          {children}
        </>);
    }
  
    if (user !== 'anonymous' && subscription !== 'active') {
       return <Box>Inactive</Box>
    //   return (
    //     <Elements stripe={stripePromise}>
    //       <Box p={1}>
    //         <Typography color='error'><FormattedMessage id={`app.stripe.${subscription}`} /></Typography>
    //         <CheckoutForm />
    //       </Box>
    //     </Elements>)
    }
    return <LogIn />;
  };
  
  export default Authenticated;