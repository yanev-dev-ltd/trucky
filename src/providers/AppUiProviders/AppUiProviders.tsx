import { useMemo, FC, PropsWithChildren } from 'react'
import {
    ThemeProvider,
    StyledEngineProvider,
    CssBaseline,
    Box,
    Typography,
} from '@mui/material'
import messagesEn from '../../translations/en.json'
import messagesBg from '../../translations/bg.json'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { Offline, Online } from 'react-detect-offline'
import useSettings from '../../hooks/useSettings'
import useTheme from '../../hooks/useTheme'
import sx from './styles/AppUiProviders.sx'
import { SnackbarProvider } from 'notistack'
import SnackbarClose from './components/SnackbarClose/SnackbarClose'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import bg from 'date-fns/locale/bg'
import en from 'date-fns/locale/en-US'
import dynamic from 'next/dynamic'

const AppUiProviders: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const settings = useSettings()
    const { theme } = useTheme()
    const messages = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return messagesBg
            default:
                return messagesEn
        }
    }, [settings.locale])
    const adapterLocale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return en
        }
    }, [settings.locale])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider key={settings.theme} theme={theme(settings.theme)}>
                <CssBaseline />
                <IntlProvider
                    locale={settings?.locale || 'en'}
                    key={settings?.locale}
                    messages={messages}
                >
                    <SnackbarProvider
                        maxSnack={5}
                        autoHideDuration={10000}
                        action={(snackbarId) => (
                            <SnackbarClose id={snackbarId} />
                        )}
                    >
                        <LocalizationProvider
                            dateAdapter={AdapterDateFns}
                            adapterLocale={adapterLocale}
                        >
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
                </IntlProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

// needed to set the correct theme
export default dynamic(() => Promise.resolve(AppUiProviders), {
    ssr: false,
})
