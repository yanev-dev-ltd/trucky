import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import sx from '../styles/Documents.sx'
import { FormattedMessage, useIntl } from 'react-intl'
import {
    Check,
    Close,
    CloudUpload,
    Edit,
    InsertDriveFile,
    NotificationsActive,
} from '@mui/icons-material'
import { Document, DocumentsProps } from '../types'
import Overflow from '@/components/common/Overflow/Overflow'
import { format, formatRelative } from 'date-fns'
import { Fragment } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { EditDocument } from '../components/EditDocument/EditDocument'
export const DocumentsView = ({
    documents,
    locale,
    downloadFile,
    setEditFile,
    editFile,
    type,
    handleAddFiles,
    clearFiles,
    filesToUpload,
    handleUpload,
    uploadError,
    uploadProgress,
    titles,
    setTitles,
    reminderDates,
    setReminderDates,
    isLoading,
    light,
}: DocumentsProps) => {
    const intl = useIntl()
    return (
        <Paper sx={light ? sx.paperLight : sx.paper}>
            <Box sx={sx.edit}>
                <input
                    type="file"
                    id={`document-upload-${type}`}
                    name="document-upload"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(event) => {
                        handleAddFiles(event)
                        event.target.value = ''
                    }}
                />
                <Tooltip title={<FormattedMessage id="app.Upload" />}>
                    <IconButton size="small">
                        <label
                            htmlFor={`document-upload-${type}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <CloudUpload />
                        </label>
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={filesToUpload.length > 0}
                    onClose={() => !isLoading && clearFiles()}
                >
                    <DialogTitle>
                        <FormattedMessage id="app.UploadFiles" />
                        <IconButton
                            aria-label="close"
                            onClick={() => !isLoading && clearFiles()}
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
                        <List dense>
                            {filesToUpload.map((file, i) => (
                                <Fragment key={i}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            flexGrow: 1,
                                            gap: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginBottom: 1,
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={titles[i] || ''}
                                            onChange={(e) => {
                                                const newTitles = [...titles]
                                                newTitles[i] = e.target.value
                                                setTitles(newTitles)
                                            }}
                                            label={
                                                <FormattedMessage id="app.Title" />
                                            }
                                        />
                                        {file.name && (
                                            <Overflow
                                                text={file.name}
                                                variant="caption"
                                            />
                                        )}
                                    </Box>
                                    <Box>
                                        <DesktopDatePicker
                                            label={
                                                <FormattedMessage id="app.ReminderDate" />
                                            }
                                            inputFormat="dd/MM/yyyy"
                                            value={reminderDates[i] || null}
                                            onChange={(d: Date | null) =>
                                                setReminderDates({
                                                    ...reminderDates,
                                                    [i]: d ? d.getTime() : null,
                                                })
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    size="small"
                                                    helperText={
                                                        <FormattedMessage id="app.ReminderInfoDate" />
                                                    }
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        placeholder:
                                                            intl.formatMessage({
                                                                id: 'app.dd/MM/yyyy',
                                                            }) || '',
                                                    }}
                                                />
                                            )}
                                            disablePast
                                        />
                                        {uploadError[i] && (
                                            <Typography
                                                color="error"
                                                variant="caption"
                                            >
                                                {uploadError[i]}
                                            </Typography>
                                        )}
                                    </Box>
                                    <LinearProgress
                                        sx={{ marginTop: 1 }}
                                        variant="determinate"
                                        value={uploadProgress[i] || 0}
                                    />
                                    <Divider
                                        sx={{ marginTop: 1, marginBottom: 1 }}
                                    />
                                </Fragment>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            onClick={() => handleUpload()}
                            startIcon={<CloudUpload />}
                            disabled={isLoading}
                        >
                            <FormattedMessage id="app.Upload" />
                        </Button>
                    </DialogActions>
                    <LinearProgress
                        sx={{ marginTop: 1 }}
                        variant="determinate"
                        value={
                            uploadProgress.reduce((a, b) => a + b, 0) /
                            uploadProgress.length
                        }
                    />
                </Dialog>
            </Box>
            <Typography>
                <FormattedMessage id="app.Documents" />
            </Typography>
            <List dense sx={sx.fixedHeight}>
                {documents &&
                    documents.length > 0 &&
                    documents.map((uf: Document, i: number) => (
                        <ListItem
                            key={i}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => setEditFile(uf)}
                                >
                                    <Edit />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={() => downloadFile(uf)}>
                                <ListItemIcon>
                                    <InsertDriveFile />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            {uf.title && (
                                                <Overflow text={uf.title} />
                                            )}
                                            <Overflow
                                                text={uf?.name || ''}
                                                variant="caption"
                                            />
                                        </>
                                    }
                                    secondary={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                alignItems: 'center',
                                            }}
                                            component={'span'}
                                        >
                                            {uf.date &&
                                                formatRelative(
                                                    new Date(uf.date),
                                                    new Date(),
                                                    { locale }
                                                )}
                                            {uf.reminderDate ? (
                                                <Box
                                                    sx={{
                                                        marginBottom: -0.5,
                                                        display: 'inline-block',
                                                    }}
                                                    component={'span'}
                                                >
                                                    {uf.status ===
                                                    'completed' ? (
                                                        <Tooltip
                                                            title={`${intl.formatMessage(
                                                                {
                                                                    id: 'app.ReminderDateCompleted',
                                                                }
                                                            )}:
                                                    ${
                                                        uf.reminderDate &&
                                                        format(
                                                            uf.reminderDate,
                                                            'dd/MM/yyyy'
                                                        )
                                                    }`}
                                                        >
                                                            <Check fontSize="small" />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip
                                                            title={`${intl.formatMessage(
                                                                {
                                                                    id: 'app.ReminderDate',
                                                                }
                                                            )}:
                                                    ${
                                                        uf.reminderDate &&
                                                        format(
                                                            uf.reminderDate,
                                                            'dd/MM/yyyy'
                                                        )
                                                    }`}
                                                        >
                                                            <NotificationsActive fontSize="small" />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            ) : null}
                                        </Box>
                                    }
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
            <EditDocument
                editDocument={editFile}
                setEditDocument={setEditFile}
            />
            {isLoading && (
                <Box display="flex" justifyContent="center" mb={2}>
                    <CircularProgress />
                </Box>
            )}
            {(!documents || documents.length === 0) && (
                <Box display="flex" justifyContent="center" mb={2}>
                    <Typography>
                        <FormattedMessage id="app.NoDocuments" />
                    </Typography>
                </Box>
            )}
        </Paper>
    )
}
