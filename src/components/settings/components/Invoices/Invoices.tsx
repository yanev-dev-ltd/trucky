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
} from '@mui/material'
import { FileDownload, Check, Euro, Close } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import sx from './styles/Invoices.sx'

const Invoices = () => {
    return (
        <>
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
                        <TableRow>
                            <TableCell>22/06/2023</TableCell>
                            <TableCell>€500</TableCell>
                            <TableCell>
                                <Close fontSize="small" sx={sx.icon} />{' '}
                                <FormattedMessage id="app.Declined" />
                            </TableCell>
                            <TableCell align="right" sx={sx.actions}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    startIcon={<Euro />}
                                >
                                    <FormattedMessage id="app.PayNow" />
                                </Button>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<FileDownload />}
                                >
                                    <FormattedMessage id="app.Download" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>22/06/2023</TableCell>
                            <TableCell>€500</TableCell>
                            <TableCell>
                                <Check fontSize="small" sx={sx.icon} />{' '}
                                <FormattedMessage id="app.Payed" />
                            </TableCell>
                            <TableCell align="right" sx={sx.actions}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<FileDownload />}
                                >
                                    <FormattedMessage id="app.Download" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Invoices
