import { useMemo } from 'react'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material'
import { theme } from '../../styles/theme'
import messagesEn from '../../translations/en.json'
import messagesBg from '../../translations/bg.json'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { Offline, Online } from 'react-detect-offline'
import { Box, Typography } from '@mui/material'
import useSettings from '../../hooks/useSettings'
import sx from './styles/AppUiProviders.sx'
import { SnackbarProvider } from 'notistack'

const AppUiProviders: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
}) => {
    const settings = useSettings()
    const messages = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return messagesBg
            default:
                return messagesEn
        }
    }, [settings])
    return (
        <IntlProvider locale={settings?.locale || 'en'} messages={messages}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme(settings?.theme || 'dark')}>
                    <SnackbarProvider maxSnack={5} autoHideDuration={5000}>
                        <CssBaseline />
                        <Online>{children}</Online>
                        <Offline>
                            <Box sx={sx.container}>
                                <Typography>
                                    <FormattedMessage id="app.Offline" />
                                </Typography>
                            </Box>
                        </Offline>
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </IntlProvider>
    )
}

export default AppUiProviders
