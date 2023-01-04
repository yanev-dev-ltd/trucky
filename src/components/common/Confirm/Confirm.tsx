import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import sx from './styles/Confirm.sx'
import { ConfirmProps } from './types'

const Confirm = ({
    isOpen,
    onCancel,
    onSubmit,
    cancel,
    message,
    type,
    submit,
}: ConfirmProps) => {
    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle>
                <FormattedMessage id="app.AreYouSure" />
                <IconButton
                    aria-label="close"
                    onClick={onCancel}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            {message && <DialogContent sx={sx.dialog}>{message}</DialogContent>}
            <DialogActions sx={sx.dialog}>
                {cancel && (
                    <Button onClick={onCancel} variant="text">
                        {cancel}
                    </Button>
                )}
                <Button
                    autoFocus
                    onClick={onSubmit}
                    sx={type ? sx[type] : undefined}
                >
                    {submit || <FormattedMessage id="app.Submit" />}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Confirm
