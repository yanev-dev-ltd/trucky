import { useMemo } from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material'
import { theme } from '../../styles/theme'
import messagesEn from '../../translations/en.json';
import messagesBg from '../../translations/bg.json';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Offline, Online } from 'react-detect-offline'
import { Box, Typography } from '@mui/material'
import store from '../../store/store'
import { Provider } from 'react-redux'

const AppUiProviders: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const messages = useMemo(() => {
        return {
            en: messagesEn,
            bg: messagesBg
        }
    },[])
    return (
        <IntlProvider locale={'en'} messages={messages['en']}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme('dark')}>
                    <Provider store={store}>
                        <Online>
                            {children}
                        </Online>
                        <Offline>
                        <Box display='flex' flexDirection='column' alignItems='center' mt={6}>
                            <Typography><FormattedMessage id='app.Offline' /></Typography>
                        </Box>
                        </Offline>
                    </Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        </IntlProvider>
    )
}

export default AppUiProviders