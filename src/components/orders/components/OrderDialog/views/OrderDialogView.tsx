import {
    Dialog,
    Box,
    DialogContent,
    Typography,
    DialogActions,
    DialogTitle,
    Button,
    IconButton,
} from '@mui/material'
import { Close, Delete } from '@mui/icons-material'
import type { OrderDialogProps } from '../types'
import sx from '../styles/OrderDialog.sx'
import { FormattedMessage } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'

const OrderDialogView = ({
    open,
    setOpen,
    addOrder,
    order,
    isNew,
    deleteOrder,
    setNewOrder,
}: OrderDialogProps) => {
    return (
        <Dialog open={open}>
            <DialogTitle sx={sx.header}>
                {isNew ? (
                    <Typography variant="h6">
                        <FormattedMessage id="app.AddOrder" />
                    </Typography>
                ) : (
                    <Typography>
                        <FormattedMessage id="app.EditOrder" />
                    </Typography>
                )}
                <IconButton onClick={() => setOpen(false)}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <Box component="form" onSubmit={() => order && addOrder(order)}>
                <DialogContent></DialogContent>
                <DialogActions
                    sx={deleteOrder && !isNew ? sx.actions : sx.actionsRight}
                >
                    {deleteOrder && !isNew && (
                        <LoadingButton
                            sx={sx.warn}
                            onClick={deleteOrder}
                            startIcon={<Delete />}
                            color="secondary"
                        >
                            <FormattedMessage id="app.DeleteOrder" />
                        </LoadingButton>
                    )}

                    <Box sx={sx.gap}>
                        <Button onClick={() => setOpen(false)}>
                            <FormattedMessage id="app.Cancel" />
                        </Button>
                        <Button variant="contained" type="submit">
                            <FormattedMessage id="app.SaveOrder" />
                        </Button>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default OrderDialogView
