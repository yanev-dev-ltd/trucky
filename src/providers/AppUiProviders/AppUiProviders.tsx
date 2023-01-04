import { useMemo } from 'react'
import {
    ThemeProvider,
    StyledEngineProvider,
    CssBaseline,
    Box,
    Typography,
} from '@mui/material'
import { theme } from '../../styles/theme'
import messagesEn from '../../translations/en.json'
import messagesBg from '../../translations/bg.json'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { Offline, Online } from 'react-detect-offline'
import useSettings from '../../hooks/useSettings'
import sx from './styles/AppUiProviders.sx'
import { SnackbarProvider } from 'notistack'
import SnackbarClose from './components/SnackbarClose/SnackbarClose'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

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
        <IntlProvider
            locale={settings?.locale || 'en'}
            key={settings?.locale}
            messages={messages}
        >
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme(settings?.theme || 'dark')}>
                    <SnackbarProvider
                        maxSnack={5}
                        autoHideDuration={10000}
                        action={(snackbarId) => (
                            <SnackbarClose id={snackbarId} />
                        )}
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <CssBaseline />
                            <Online>{children}</Online>
                            <Offline>
                                <Box sx={sx.container}>
                                    <Typography>
                                        <FormattedMessage id="app.Offline" />
                                    </Typography>
                                </Box>
                            </Offline>
                        </LocalizationProvider>
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </IntlProvider>
    )
}

export default AppUiProviders
