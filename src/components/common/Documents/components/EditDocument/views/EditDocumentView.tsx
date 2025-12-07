import { Close } from '@mui/icons-material'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import sx from '../styles/EditDocument.sx'
import Overflow from '@/components/common/Overflow/Overflow'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { EditDocumentProps } from '../types'
import Confirm from '@/components/common/Confirm/Confirm'
import { format } from 'date-fns'

export const EditDocumentView = ({
    isLoading,
    document,
    setDocument,
    saveDocument,
    cancel,
    deleteDocument,
    setConfirmDeleteDocument,
    confirmDeleteDocument,
}: EditDocumentProps) => {
    const intl = useIntl()
    return (
        <Dialog open={Boolean(document)} onClose={() => !isLoading && cancel()}>
            <DialogTitle>
                <FormattedMessage id="app.EditDocument" />
                <IconButton
                    aria-label="close"
                    onClick={() => !isLoading && cancel()}
                    disabled={isLoading}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={sx.dialog}>
                <Box
                    sx={{
                        width: '100%',
                        flexGrow: 1,
                        gap: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: 1,
                        marginTop: 1,
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        value={document?.title || ''}
                        onChange={(e) => {
                            setDocument({
                                key: document?.key || '',
                                ...document,
                                title: e.target.value,
                            })
                        }}
                        label={<FormattedMessage id="app.Title" />}
                    />
                    {document?.name && (
                        <Overflow text={document.name} variant="caption" />
                    )}
                </Box>
                <Box>
                    {document?.status !== 'completed' ? (
                        <DesktopDatePicker
                            label={<FormattedMessage id="app.ReminderDate" />}
                            format="dd/MM/yyyy"
                            value={
                                document?.reminderDate
                                    ? new Date(document.reminderDate)
                                    : null
                            }
                            onChange={(d: Date | null) =>
                                setDocument({
                                    key: document?.key || '',
                                    ...document,
                                    reminderDate: d ? d.getTime() : null,
                                })
                            }
                            disablePast
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    helperText: (
                                        <FormattedMessage id="app.ReminderInfoDate" />
                                    ),
                                    placeholder:
                                        intl.formatMessage({
                                            id: 'app.dd/MM/yyyy',
                                        }) || '',
                                },
                            }}
                        />
                    ) : (
                        <Typography>
                            <FormattedMessage id="app.ReminderDateCompleted" />:{' '}
                            {document.reminderDate &&
                                format(document.reminderDate, 'dd/MM/yyyy')}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        paddingLeft: 2,
                        paddingRight: 2,
                        paddingBottom: 2,
                    }}
                >
                    {document?.key && (
                        <>
                            <Button
                                onClick={() => setConfirmDeleteDocument(true)}
                                disabled={isLoading}
                                color="error"
                                variant="contained"
                            >
                                <FormattedMessage id="app.Delete" />
                            </Button>
                            <Confirm
                                onCancel={() => setConfirmDeleteDocument(false)}
                                onSubmit={() => {
                                    deleteDocument()
                                    setConfirmDeleteDocument(false)
                                }}
                                isOpen={confirmDeleteDocument}
                                message={
                                    <FormattedMessage
                                        id="app.Deleting"
                                        values={{
                                            name: (
                                                <Overflow
                                                    text={document.name || ''}
                                                />
                                            ),
                                        }}
                                    />
                                }
                                type="warn"
                                submit={<FormattedMessage id="app.Delete" />}
                                cancel={<FormattedMessage id="app.Cancel" />}
                            />
                        </>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            onClick={() => !isLoading && cancel()}
                            disabled={isLoading}
                        >
                            <FormattedMessage id="app.Cancel" />
                        </Button>
                        <LoadingButton
                            autoFocus
                            onClick={() => saveDocument()}
                            disabled={isLoading}
                            isLoading={isLoading}
                            variant="contained"
                        >
                            <FormattedMessage id="app.Save" />
                        </LoadingButton>
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    )
}
