import { type AppType } from "next/app";
import AppUiProviders from '../providers/AppUiProviders/AppUiProviders'
import AppAuthProvider from '../providers/AppAuthProvider/AppAuthProvider'

const MyApp: AppType = ({
  Component,
  pageProps,
}) => {
  return (
    <AppUiProviders>
      <AppAuthProvider>
        <Component {...pageProps} />
      </AppAuthProvider>
    </AppUiProviders>
  );
};

export default MyApp;
