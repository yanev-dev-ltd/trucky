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
import sx from '../styles/AddGroup.sx'
import { AddGroupProps } from '../types'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
const AddGroupView = ({
    save,
    setOpen,
    open,
    changeField,
    newGroup,
    newGroupLoading,
}: AddGroupProps) => {
    return (
        <Modal open={Boolean(open)}>
            <Box sx={sx.wrap}>
                <Paper sx={sx.modal}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.AddGroup" />
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
                            if (!newGroup?.name) return
                            save()
                        }}
                    >
                        <Paper sx={sx.paper}>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    fullWidth
                                    value={newGroup?.name || ''}
                                    onChange={(e) =>
                                        changeField('name', e.target.value)
                                    }
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.Description" />
                                    }
                                    fullWidth
                                    multiline
                                    sx={sx.select}
                                    value={newGroup?.description || ''}
                                    onChange={(e) =>
                                        changeField(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                />
                            </Box>
                            <Box sx={sx.paddingTop}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    disabled={!newGroup?.name}
                                    type="submit"
                                    isLoading={newGroupLoading}
                                    fullWidth
                                >
                                    <FormattedMessage id="app.AddGroup" />
                                </LoadingButton>
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    )
}

export default AddGroupView
