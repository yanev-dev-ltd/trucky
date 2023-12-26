import {
    Box,
    Typography,
    TextField,
    Container,
    Button,
    Modal,
    Paper,
} from '@mui/material'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import useLogin from './hooks/useLogin'
import sx from './styles/LogIn.sx'
import { FormattedMessage } from 'react-intl'
import Link from '@mui/material/Link'
import useForgotPassword from './hooks/useForgotPassword'

const LogIn = () => {
    const { onSubmit, loading, emailRef, passwordRef, locale } = useLogin()
    const {
        setForgotEmail,
        forgotEmail,
        forgotOpen,
        handleForgotClose,
        handleForgotOpen,
        handleForgotPassword,
        forgotLoading,
    } = useForgotPassword()

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
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        isLoading={loading}
                        sx={sx.submit}
                        size="large"
                    >
                        <FormattedMessage id="app.LogIn" />
                    </LoadingButton>
                    <Button onClick={handleForgotOpen}>
                        <FormattedMessage id="app.ForgotPassword" />
                    </Button>
                    <Modal open={forgotOpen} onClose={handleForgotClose}>
                        <Paper sx={sx.modal}>
                            <Box sx={sx.padding}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="forgot-email"
                                    label={<FormattedMessage id="app.Email" />}
                                    type="email"
                                    id="forgot-email"
                                    autoComplete="current-password"
                                    value={forgotEmail || ''}
                                    onChange={(e) =>
                                        setForgotEmail(e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.actions}>
                                <Button
                                    color="primary"
                                    onClick={handleForgotClose}
                                >
                                    <FormattedMessage id="app.Cancel" />
                                </Button>
                                <LoadingButton
                                    onClick={handleForgotPassword}
                                    disabled={!Boolean(forgotEmail)}
                                    isLoading={forgotLoading}
                                    variant="contained"
                                    color="primary"
                                >
                                    <FormattedMessage id="app.ResetPassword" />
                                </LoadingButton>
                            </Box>
                        </Paper>
                    </Modal>
                </Box>
                <Typography sx={{ padding: 1 }}>
                    <FormattedMessage id="app.DontHaveAnAccount" />{' '}
                    <Link href={`/registration/${locale}`}>
                        <FormattedMessage id="app.Registration" />
                    </Link>
                </Typography>
            </Box>
        </Container>
    )
}

export default LogIn
