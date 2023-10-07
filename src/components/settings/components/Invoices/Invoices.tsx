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
    CircularProgress,
    Typography,
} from '@mui/material'
import { FileDownload, Check, Euro, Close } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import sx from './styles/Invoices.sx'
import { format } from 'date-fns'
import useInvoices from './hooks/useInvoices'

const Invoices = () => {
    const { receipts, makePayment } = useInvoices()
    if (receipts?.[0]?.key === 'loading') {
        return (
            <Box sx={sx.loading}>
                <CircularProgress />
            </Box>
        )
    }
    if (receipts.length === 0) {
        return (
            <Box sx={sx.loading}>
                <Typography>
                    <FormattedMessage id="app.NoInvoices" />
                </Typography>
            </Box>
        )
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={sx.table} aria-label="invoice table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="app.Date" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="app.Amount" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="app.Status" />
                        </TableCell>
                        <TableCell align="right">
                            <FormattedMessage id="app.Actions" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receipts.map((receipt, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                {receipt.date
                                    ? format(receipt?.date, 'dd/MM/yy HH:ss')
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                €
                                {receipt.amount_paid &&
                                    (receipt.amount_paid / 100).toFixed(2)}
                            </TableCell>
                            <TableCell>
                                {receipt.status === 'Declined' && (
                                    <>
                                        <Close fontSize="small" sx={sx.icon} />{' '}
                                        <FormattedMessage id="app.Declined" />
                                    </>
                                )}
                                {receipt.status === 'Payed' && (
                                    <>
                                        <Check fontSize="small" sx={sx.icon} />{' '}
                                        <FormattedMessage id="app.Payed" />
                                    </>
                                )}
                            </TableCell>
                            <TableCell align="right" sx={sx.actions}>
                                {receipt.status === 'Declined' && (
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        startIcon={<Euro />}
                                        onClick={() =>
                                            makePayment(receipt.invoice)
                                        }
                                    >
                                        <FormattedMessage id="app.PayNow" />
                                    </Button>
                                )}
                                {receipt.status === 'Payed' && (
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        startIcon={<FileDownload />}
                                        href={receipt.receipt}
                                        // target="_blank"
                                    >
                                        <FormattedMessage id="app.Download" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Invoices
