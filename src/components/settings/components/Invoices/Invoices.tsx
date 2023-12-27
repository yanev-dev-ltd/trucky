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
import {
    FileDownload,
    Check,
    Euro,
    Close,
    Payment,
    Support,
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import sx from './styles/Invoices.sx'
import { format } from 'date-fns'
import useInvoices from './hooks/useInvoices'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { useRouter } from 'next/router'

const Invoices = () => {
    const { receipts, makePayment, loading, card_last4 } = useInvoices()
    const router = useRouter()
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
                                    ? format(receipt?.date * 1000, 'dd/MM/yyyy')
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                €
                                {receipt.amount &&
                                    (receipt.amount / 100).toFixed(2)}
                            </TableCell>
                            <TableCell>
                                {receipt.status === 'declined' ||
                                    (receipt.status === 'open' && (
                                        <>
                                            <Close
                                                fontSize="small"
                                                sx={sx.icon}
                                            />{' '}
                                            <FormattedMessage id="app.Declined" />
                                        </>
                                    ))}
                                {receipt.status === 'paid' && (
                                    <>
                                        <Check fontSize="small" sx={sx.icon} />{' '}
                                        <FormattedMessage id="app.Paid" />
                                    </>
                                )}
                                {(receipt.status === 'void' ||
                                    receipt.status === 'uncollectible') && (
                                    <>
                                        <Close fontSize="small" sx={sx.icon} />{' '}
                                        <FormattedMessage id="app.Canceled" />
                                    </>
                                )}
                                {(receipt.status === 'manual' ||
                                    receipt.status === 'draft') && (
                                    <>
                                        <Payment
                                            fontSize="small"
                                            sx={sx.icon}
                                        />{' '}
                                        <FormattedMessage id="app.ManualPayment" />
                                    </>
                                )}
                            </TableCell>
                            <TableCell align="right" sx={sx.actions}>
                                {(receipt.status === 'void' ||
                                    receipt.status === 'uncollectible') && (
                                    <Button
                                        component="a"
                                        href="https://support.trucky.one"
                                        target="_blank"
                                        variant="outlined"
                                        startIcon={<Support />}
                                    >
                                        <FormattedMessage id="app.ContactSupport" />
                                    </Button>
                                )}
                                {(receipt.status === 'manual' ||
                                    receipt.status === 'open' ||
                                    receipt.status === 'draft') && (
                                    <>
                                        <LoadingButton
                                            color="primary"
                                            variant="contained"
                                            startIcon={<Euro />}
                                            onClick={() =>
                                                makePayment(receipt.key)
                                            }
                                            isLoading={loading}
                                            disabled={!card_last4}
                                        >
                                            <FormattedMessage id="app.PayNow" />
                                        </LoadingButton>
                                        {!card_last4 && (
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                onClick={() =>
                                                    router.push(
                                                        '/settings/payment'
                                                    )
                                                }
                                            >
                                                <FormattedMessage id="app.AddPaymentMethod" />
                                            </Button>
                                        )}
                                    </>
                                )}
                                {receipt.status === 'paid' && (
                                    <Button
                                        component="a"
                                        color="primary"
                                        variant="outlined"
                                        startIcon={<FileDownload />}
                                        href={receipt.invoicePdf}
                                        download
                                        disabled={!receipt.invoicePdf}
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
