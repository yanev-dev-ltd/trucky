import { Box, Typography, TextField, Container } from '@mui/material'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import useLogin from './hooks/useLogin'
import sx from './styles/LogIn.sx'
import { FormattedMessage } from 'react-intl'

const LogIn = () => {
    const { onSubmit, loading, error, emailRef, passwordRef } = useLogin()

    return (
        <Container component="main" maxWidth="xs" sx={sx.loginContainer}>
            <Box sx={sx.box} component="form" onSubmit={onSubmit}>
                <Typography component="h1" variant="h5">
                    <FormattedMessage id="app.LogIn" />
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
                    autoFocus
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
                {error && <Typography>{error}</Typography>}
                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    isLoading={loading}
                    sx={sx.submit}
                    size="large"
                >
                    <FormattedMessage id="app.LogIn" />
                </LoadingButton>
            </Box>
        </Container>
    )
}

export default LogIn
