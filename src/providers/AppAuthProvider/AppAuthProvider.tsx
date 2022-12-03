import LogIn from './components/LogIn/LogIn'
import useAppAuthProvider from './hooks/useAppAuthProvider'
import { Box, CircularProgress} from '@mui/material'


const Authenticated: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const user = useAppAuthProvider()
  
    // if (error || subError) {
    //   return (
    //     <Box display='flex' flexDirection='column' alignItems='center' mt={6}>
    //       <Typography><FormattedMessage id='app.Wrong' /></Typography>
    //     </Box>
    //   );
    // }
  
    if (user === 'loading') {
      return (
        <Box display='flex' flexDirection='column' alignItems='center' mt={6}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (user !== 'anonymous') {
      return (
        <>
          {children}
        </>);
    }
  
    // if (auth && subscription !== 'active') {
    //   return (
    //     <Elements stripe={stripePromise}>
    //       <Box p={1}>
    //         <Typography color='error'><FormattedMessage id={`app.stripe.${subscription}`} /></Typography>
    //         <CheckoutForm />
    //       </Box>
    //     </Elements>);
    // }
    return <LogIn />;
  };
  
  export default Authenticated;