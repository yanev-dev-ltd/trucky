import { useSelector } from 'react-redux'
import LogIn from './components/LogIn/LogIn'
import { RootState } from '../../store/store'

const Authenticated: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.user)
  
    // if (error || subError) {
    //   return (
    //     <Box display='flex' flexDirection='column' alignItems='center' mt={6}>
    //       <Typography><FormattedMessage id='app.Wrong' /></Typography>
    //     </Box>
    //   );
    // }
  
    // if (isFetching || subIsFetching) {
    //   return (
    //     <Box display='flex' flexDirection='column' alignItems='center' mt={6}>
    //       <CircularProgress />
    //     </Box>
    //   );
    // }
  
    if (user) {
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