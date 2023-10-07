import { useState } from 'react'
import {
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Typography,
    Modal,
} from '@mui/material'
import usePayment from './hooks/usePayment'
import sx from './styles/Payment.sx'
import { FormattedMessage } from 'react-intl'
import CheckoutForm from './components/CheckoutForm/CheckoutForm'
import Confirm from '@/components/common/Confirm/Confirm'

const Payment = () => {
    const { stripe, handleFormOpen, handleFormClose, formOpened, deleteCard } =
        usePayment()
    const [confirmDeleteCard, setConfirmDeleteCard] = useState(false)
    return (
        <Box>
            {stripe.card && (
                <TableContainer component={Paper}>
                    <Table sx={sx.table} aria-label="credit card table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <FormattedMessage id="app.Name" />
                                </TableCell>
                                <TableCell>
                                    <FormattedMessage id="app.Phone" />
                                </TableCell>
                                <TableCell>
                                    <FormattedMessage id="app.Email" />
                                </TableCell>
                                <TableCell>
                                    <FormattedMessage id="app.CardNumber" />
                                </TableCell>
                                <TableCell align="right">
                                    <FormattedMessage id="app.Actions" />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{stripe.card.name}</TableCell>
                                <TableCell>{stripe.card.phone}</TableCell>
                                <TableCell>{stripe.card.email}</TableCell>
                                <TableCell>
                                    ••••&nbsp;••••&nbsp;••••&nbsp;
                                    {stripe.card.last4}
                                    <Box>
                                        <Typography variant="caption">
                                            <FormattedMessage id="app.Expires" />{' '}
                                            <FormattedMessage
                                                id={
                                                    'app.MonthShort.' +
                                                    stripe.card.exp_month
                                                }
                                            />{' '}
                                            {stripe.card.exp_year}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        color="primary"
                                        onClick={() =>
                                            setConfirmDeleteCard(true)
                                        }
                                        variant="contained"
                                    >
                                        <FormattedMessage id="app.Delete" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {stripe.card ? null : (
                <Typography sx={sx.padding}>
                    <FormattedMessage id="app.NoCreditCard" />
                </Typography>
            )}
            {stripe.card ? null : (
                <Button
                    onClick={handleFormOpen}
                    color="primary"
                    variant="contained"
                >
                    <FormattedMessage id="app.AddCard" />
                </Button>
            )}
            <Modal open={formOpened} onClose={handleFormClose}>
                <Paper sx={sx.modal}>
                    <CheckoutForm handleFormClose={handleFormClose} />
                </Paper>
            </Modal>
            <Confirm
                onCancel={() => setConfirmDeleteCard(false)}
                onSubmit={() => {
                    deleteCard()
                    setConfirmDeleteCard(false)
                }}
                isOpen={Boolean(confirmDeleteCard)}
                type="warn"
                submit={<FormattedMessage id="app.Delete" />}
                cancel={<FormattedMessage id="app.Cancel" />}
            />
        </Box>
    )
}

export default Payment
