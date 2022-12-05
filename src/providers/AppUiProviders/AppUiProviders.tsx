import { useMemo } from 'react'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material'
import { theme } from '../../styles/theme'
import messagesEn from '../../translations/en.json';
import messagesBg from '../../translations/bg.json';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Offline, Online } from 'react-detect-offline'
import { Box, Typography } from '@mui/material'
import useAppUiProvider  from '../AppUiProviders/hooks/useAppUiProvider'
import sx from './styles/AppUiProviders.sx'

const AppUiProviders: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const settings = useAppUiProvider()
    const messages = useMemo(() => {
        switch (settings?.locale) {
            case 'bg': return messagesBg
            default: return messagesEn
        }
    },[settings])
    return (
        <IntlProvider locale={settings?.locale || 'en'} messages={messages}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme(settings?.theme || 'dark')}>
                    <CssBaseline />
                    <Online>
                        {children}
                    </Online>
                    <Offline>
                        <Box sx={sx.container}>
                            <Typography><FormattedMessage id='app.Offline' /></Typography>
                        </Box>
                    </Offline>
                </ThemeProvider>
            </StyledEngineProvider>
        </IntlProvider>
    )
}

export default AppUiProviders