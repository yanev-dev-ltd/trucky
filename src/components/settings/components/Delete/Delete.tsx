import { Typography, Button, Modal, Paper } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import sx from './styles/Delete.sx'
import { FormattedMessage } from 'react-intl'
import useDelete from './hooks/useDelete'

const Delete = () => {
    const {
        handleDeleteAccount,
        handleModalOpen,
        handleModalClose,
        modalOpen,
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
                    <Button color="primary" onClick={handleModalClose}>
                        <FormattedMessage id="app.Cancel" />
                    </Button>
                    <Button
                        sx={sx.warn}
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteAccount}
                    >
                        <FormattedMessage id="app.DeleteAccount" />
                    </Button>
                </Paper>
            </Modal>
        </>
    )
}

export default Delete
