import {
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material'
import { CloudUpload, InsertDriveFile, Close } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import useUpload from './hooks/useUpload'
import { UploadProps } from './types'
import sx from './styles/Upload.sx'
const Upload = ({ filepath, dbpath, currentFiles }: UploadProps) => {
    const {
        files,
        clearFiles,
        handleAddFiles,
        handleUpload,
        uploadError,
        uploadProgress,
    } = useUpload({
        filepath,
        dbpath,
        currentFiles,
    })

    return (
        <form>
            <input
                type="file"
                id="document-upload"
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
                        htmlFor="document-upload"
                        style={{ cursor: 'pointer' }}
                    >
                        <CloudUpload />
                    </label>
                </IconButton>
            </Tooltip>
            <Dialog open={files.length > 0} onClose={clearFiles}>
                <DialogTitle>
                    <FormattedMessage id="app.UploadFiles" />
                    <IconButton
                        aria-label="close"
                        onClick={clearFiles}
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
                        {files.map((file, i) => (
                            <ListItem key={i} sx={sx.item}>
                                <ListItemIcon>
                                    <InsertDriveFile />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        file.file?.name &&
                                        file.file?.name.length > 30 ? (
                                            <Tooltip title={file.file?.name}>
                                                <Typography sx={sx.textWrap}>
                                                    {file.file?.name}
                                                </Typography>
                                            </Tooltip>
                                        ) : (
                                            <Typography sx={sx.textWrap}>
                                                {file.file?.name}
                                            </Typography>
                                        )
                                    }
                                    secondary={
                                        uploadError?.[i] ? (
                                            <FormattedMessage
                                                id={uploadError[i]}
                                            />
                                        ) : (
                                            Math.round(uploadProgress[i] || 0) +
                                            '%'
                                        )
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={handleUpload}
                        startIcon={<CloudUpload />}
                    >
                        <FormattedMessage id="app.Upload" />
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    )
}

export default Upload
