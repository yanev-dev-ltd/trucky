import {
    Dialog,
    Box,
    DialogContent,
    Typography,
    TextField,
    Autocomplete,
    DialogActions,
    DialogTitle,
    Button,
    Grid,
    CircularProgress,
    IconButton,
    Checkbox,
    FormControlLabel,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import type { OrderDialogProps } from '../types'
import sx from '../sx/OrderDialog.sx'
import { FormattedMessage } from 'react-intl'

const OrderDialogView = ({
    open,
    setOpen,
    addOrder,
    order,
    isNew,
}: OrderDialogProps) => {
    return (
        <Dialog open={open || false}>
            <DialogTitle sx={sx.header}>
                <FormattedMessage id="app.AddOrder" />
                <IconButton onClick={() => setOpen(false)}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent></DialogContent>
        </Dialog>
    )
}

export default OrderDialogView
