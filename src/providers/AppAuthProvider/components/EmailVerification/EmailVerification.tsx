import { Box, Button, Typography } from '@mui/material'
import sx from './styles/EmailVerification.sx'
import { FormattedMessage } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import useEmailVerification from './hooks/useEmailVerification'
const EmailVerification = () => {
    const { resendEmailVerification, loading, sent } = useEmailVerification()
    return (
        <Box sx={sx.container}>
            <Typography variant="h4">
                <FormattedMessage id="app.EmailVerification" />
            </Typography>
            <Typography>
                <FormattedMessage id="app.EmailVerificationText" />
            </Typography>
            <LoadingButton
                variant="contained"
                isLoading={loading}
                onClick={resendEmailVerification}
                color="primary"
            >
                <FormattedMessage id="app.ResendEmailVerification" />
            </LoadingButton>
            {sent && !loading && (
                <Typography variant="h6">
                    <FormattedMessage id="app.EmailVerificationSent" />
                </Typography>
            )}
        </Box>
    )
}

export default EmailVerification
