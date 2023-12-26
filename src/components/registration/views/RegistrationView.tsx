import { useMemo, FC } from 'react'
import { Box, Typography, TextField, Container } from '@mui/material'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import sx from '../styles/Registration.sx'
import { RegistrationProps } from '../types'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messagesEn from '../../../translations/en.json'
import messagesBg from '../../../translations/bg.json'
import Link from '@mui/material/Link'

export const RegistrationView: FC<RegistrationProps> = ({
    onSubmit,
    loading,
    error,
    emailRef,
    passwordRef,
    password2Ref,
    locale,
}): JSX.Element => {
    const messages = useMemo(() => {
        switch (locale) {
            case 'bg':
                return messagesBg
            default:
                return messagesEn
        }
    }, [locale])
    return (
        <IntlProvider locale={locale || 'en'} key={locale} messages={messages}>
            <Container component="main" maxWidth="xs" sx={sx.loginContainer}>
                <Box sx={sx.box} component="form" onSubmit={onSubmit}>
                    <Typography component="h1" variant="h5">
                        <FormattedMessage id="app.Registration" />
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={<FormattedMessage id="app.Email" />}
                        name="email"
                        autoComplete="email"
                        InputProps={{
                            type: 'email',
                        }}
                        inputRef={emailRef}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={<FormattedMessage id="app.Password" />}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        inputRef={passwordRef}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label={<FormattedMessage id="app.PasswordAgain" />}
                        type="password"
                        id="password2"
                        autoComplete="current-password"
                        inputRef={password2Ref}
                    />
                    {error && (
                        <Typography>
                            {<FormattedMessage id={`app.${error}`} />}
                        </Typography>
                    )}
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        isLoading={loading}
                        sx={sx.submit}
                        size="large"
                    >
                        <FormattedMessage id="app.Register" />
                    </LoadingButton>
                    <Typography sx={{ padding: 1 }}>
                        <FormattedMessage id="app.HaveAnAccount" />{' '}
                        <Link href="/" color="primary">
                            <FormattedMessage id="app.LogIn" />
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </IntlProvider>
    )
}
