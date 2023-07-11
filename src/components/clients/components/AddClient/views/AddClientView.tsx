import {
    Box,
    Typography,
    IconButton,
    Paper,
    TextField,
    Modal,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import sx from '../styles/AddClient.sx'
import { AddClientProps } from '../types'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
const AddClientView = ({
    save,
    setOpen,
    open,
    changeField,
    newClient,
    newClientLoading,
}: AddClientProps) => {
    return (
        <Modal open={Boolean(open)}>
            <Box sx={sx.wrap}>
                <Paper sx={sx.modal}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.AddClient" />
                        </Typography>
                        <IconButton size="small" onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        onSubmit={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (!newClient?.name) return
                            save()
                        }}
                    >
                        <Paper sx={sx.paper}>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    fullWidth
                                    value={newClient?.name || ''}
                                    onChange={(e) =>
                                        changeField('name', e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.ContactPerson" />
                                    }
                                    fullWidth
                                    sx={sx.select}
                                    value={newClient?.contactPerson || ''}
                                    onChange={(e) =>
                                        changeField(
                                            'contactPerson',
                                            e.target.value
                                        )
                                    }
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Phone" />}
                                    fullWidth
                                    sx={sx.select}
                                    value={newClient?.phone || ''}
                                    onChange={(e) =>
                                        changeField('phone', e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Email" />}
                                    fullWidth
                                    sx={sx.select}
                                    value={newClient?.email || ''}
                                    onChange={(e) =>
                                        changeField('email', e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.Address" />
                                    }
                                    fullWidth
                                    sx={sx.select}
                                    value={newClient?.address || ''}
                                    onChange={(e) =>
                                        changeField('address', e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.paddingTop}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    disabled={!newClient?.name}
                                    type="submit"
                                    isLoading={newClientLoading}
                                    fullWidth
                                >
                                    <FormattedMessage id="app.AddClient" />
                                </LoadingButton>
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    )
}

export default AddClientView
