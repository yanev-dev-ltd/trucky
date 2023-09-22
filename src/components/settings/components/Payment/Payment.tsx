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
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './components/CheckoutForm/CheckoutForm'

const Payment = () => {
    const {
        card,
        stripePromise,
        handleFormOpen,
        handleFormClose,
        formOpened,
        deleteCard,
    } = usePayment()
    return (
        <Box>
            {card && (
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
                                <TableCell>{card.name}</TableCell>
                                <TableCell>{card.phone}</TableCell>
                                <TableCell>{card.email}</TableCell>
                                <TableCell>
                                    ••••&nbsp;••••&nbsp;••••&nbsp;{card.last4}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        color="primary"
                                        onClick={deleteCard}
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
            {card ? null : (
                <Typography sx={sx.padding}>
                    <FormattedMessage id="app.NoCreditCard" />
                </Typography>
            )}
            {card ? null : (
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
                    <Elements stripe={stripePromise}>
                        <CheckoutForm handleFormClose={handleFormClose} />
                    </Elements>
                </Paper>
            </Modal>
        </Box>
    )
}

export default Payment
