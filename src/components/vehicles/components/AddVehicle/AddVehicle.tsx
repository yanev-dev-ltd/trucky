import {
    Box,
    Typography,
    TextField,
    Modal,
    Paper,
    IconButton,
    Button,
    Tooltip,
} from '@mui/material'
import { Close, Add } from '@mui/icons-material'
import LoadingButton from '../../../common/LoadingButton/LoadingButton'
import { FormattedMessage } from 'react-intl'
import useAddVehicle from './hooks/useAddVehicle'
import sx from './styles/AddVehicle.sx'

const AddVehicle = () => {
    const {
        open,
        handleClose,
        handleAddVehicle,
        setNewVehicleName,
        addVehicle,
        newVehicleName,
        newVehicleLoading,
    } = useAddVehicle()

    return (
        <>
            <Tooltip title="ctrl + N">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddVehicle}
                    style={{ marginLeft: 'auto' }}
                >
                    <FormattedMessage id="app.addVehicle" />
                </Button>
            </Tooltip>
            <Modal open={open}>
                <Box sx={sx.wrap}>
                    <Paper sx={sx.modal}>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault()
                                addVehicle()
                            }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                sx={sx.paddingBottom}
                            >
                                <Typography variant="h6">
                                    <FormattedMessage id="app.addVehicle" />
                                </Typography>
                                <IconButton onClick={handleClose}>
                                    <Close />
                                </IconButton>
                            </Box>
                            <TextField
                                variant="outlined"
                                label={
                                    <FormattedMessage id="app.VehicleName" />
                                }
                                onChange={(e) =>
                                    setNewVehicleName(e.target.value)
                                }
                                fullWidth
                            />
                            <Box sx={sx.paddingTop}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    disabled={!newVehicleName}
                                    type="submit"
                                    isLoading={newVehicleLoading}
                                    fullWidth
                                >
                                    <FormattedMessage id="app.addVehicle" />
                                </LoadingButton>
                            </Box>
                        </form>
                    </Paper>
                </Box>
            </Modal>
        </>
    )
}

export default AddVehicle
