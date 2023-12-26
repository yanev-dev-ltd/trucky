import { Typography, Button, Modal, Paper, Box, TextField } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import sx from './styles/Delete.sx'
import { FormattedMessage } from 'react-intl'
import useDelete from './hooks/useDelete'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'

const Delete = () => {
    const {
        handleDeleteAccount,
        handleModalOpen,
        handleModalClose,
        modalOpen,
        password,
        setPassword,
        loading,
        error,
    } = useDelete()
    return (
        <>
            <Typography sx={sx.padding}>
                <FormattedMessage id="app.Warning" />
            </Typography>
            <Button
                sx={sx.warn}
                startIcon={<DeleteIcon />}
                onClick={handleModalOpen}
            >
                <FormattedMessage id="app.DeleteAccount" />
            </Button>
            <Modal open={modalOpen} onClose={handleModalClose}>
                <Paper sx={sx.modal}>
                    <Box sx={sx.padding}>
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
                            value={password || ''}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography>
                                {<FormattedMessage id={`app.${error}`} />}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={sx.box}>
                        <Button color="primary" onClick={handleModalClose}>
                            <FormattedMessage id="app.Cancel" />
                        </Button>
                        <LoadingButton
                            sx={sx.warn}
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteAccount}
                            disabled={!Boolean(password)}
                            isLoading={loading}
                        >
                            <FormattedMessage id="app.DeleteAccount" />
                        </LoadingButton>
                    </Box>
                </Paper>
            </Modal>
        </>
    )
}

export default Delete
