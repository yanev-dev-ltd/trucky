import { type AppType } from "next/app";
import AppUiProviders from '../providers/AppUiProviders/AppUiProviders'
import AppAuthProvider from '../providers/AppAuthProvider/AppAuthProvider'
import AppReduxProvider from '../providers/AppReduxProvider/AppReduxProvider'


const MyApp: AppType = ({
  Component,
  pageProps,
}) => {
  return (
    <AppReduxProvider>
      <AppUiProviders>
        <AppAuthProvider>
          <Component {...pageProps} />
        </AppAuthProvider>
      </AppUiProviders>
    </AppReduxProvider>
  );
};

export default MyApp;
