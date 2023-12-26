import { Box, TextField } from '@mui/material'
import usePassword from './hooks/usePassword'
import { FormattedMessage } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'

const Password = () => {
    const {
        oldPasswordRef,
        newPasswordRef,
        newPassword2Ref,
        formRef,
        changePassword,
        loading,
    } = usePassword()
    return (
        <Box component="form" onSubmit={changePassword} ref={formRef}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="oldPassword"
                label={<FormattedMessage id="app.OldPassword" />}
                type="password"
                id="oldPassword"
                autoComplete="current-password"
                inputRef={oldPasswordRef}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label={<FormattedMessage id="app.NewPassword" />}
                type="password"
                id="newPassword"
                autoComplete="current-password"
                inputRef={newPasswordRef}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword2"
                label={<FormattedMessage id="app.NewPassword2" />}
                type="password"
                id="newPassword2"
                autoComplete="current-password"
                inputRef={newPassword2Ref}
            />
            <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                isLoading={loading}
            >
                <FormattedMessage id="app.ChangePassword" />
            </LoadingButton>
        </Box>
    )
}

export default Password
