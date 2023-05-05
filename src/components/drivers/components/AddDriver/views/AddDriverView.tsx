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
import sx from '../styles/AddDriver.sx'
import { AddDriverProps } from '../types'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
const AddDriverView = ({
    save,
    setOpen,
    open,
    changeField,
    newDriver,
    newDriverLoading,
}: AddDriverProps) => {
    return (
        <Modal open={Boolean(open)}>
            <Box sx={sx.wrap}>
                <Paper sx={sx.modal}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.AddDriver" />
                        </Typography>
                        <IconButton size="small" onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        onSubmit={(event) => {
                            event.preventDefault()
                            if (!newDriver?.name) return
                            save()
                        }}
                    >
                        <Paper sx={sx.paper}>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    fullWidth
                                    value={newDriver?.name || ''}
                                    onChange={(e) =>
                                        changeField('name', e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Phone" />}
                                    fullWidth
                                    sx={sx.select}
                                    value={newDriver?.phone || ''}
                                    onChange={(e) =>
                                        changeField('phone', e.target.value)
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
                                    value={newDriver?.address || ''}
                                    onChange={(e) =>
                                        changeField('address', e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.paddingTop}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    disabled={!newDriver?.name}
                                    type="submit"
                                    isLoading={newDriverLoading}
                                    fullWidth
                                >
                                    <FormattedMessage id="app.AddDriver" />
                                </LoadingButton>
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    )
}

export default AddDriverView
