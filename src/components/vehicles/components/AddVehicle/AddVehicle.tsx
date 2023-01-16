import {
    Box,
    Typography,
    TextField,
    Modal,
    Paper,
    IconButton,
    Button,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material'
import { Close, Add } from '@mui/icons-material'
import LoadingButton from '../../../common/LoadingButton/LoadingButton'
import { FormattedMessage } from 'react-intl'
import useAddVehicle from './hooks/useAddVehicle'
import sx from './styles/AddVehicle.sx'
import { FuelTypes, VehicleTypes } from '../../types'

const AddVehicle = () => {
    const {
        open,
        handleClose,
        handleAddVehicle,
        changeField,
        addVehicle,
        newVehicle,
        newVehicleLoading,
    } = useAddVehicle()
    const typeKeys = Object.keys(VehicleTypes) as Array<
        keyof typeof VehicleTypes
    >
    const fuelKeys = Object.keys(FuelTypes) as Array<keyof typeof FuelTypes>

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
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.VehicleName" />
                                    }
                                    value={newVehicle?.name || ''}
                                    onChange={(e) =>
                                        changeField('name', e.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    sx={sx.select}
                                >
                                    <InputLabel id="type-label">
                                        <FormattedMessage id="app.Type" />
                                    </InputLabel>
                                    <Select
                                        labelId="type-label"
                                        id="type"
                                        value={newVehicle?.type || ''}
                                        onChange={(event) =>
                                            changeField(
                                                'type',
                                                event.target.value
                                            )
                                        }
                                        label={
                                            <FormattedMessage id="app.Type" />
                                        }
                                    >
                                        {!newVehicle?.type && (
                                            <MenuItem value={''} disabled>
                                                &#8212;
                                            </MenuItem>
                                        )}
                                        {typeKeys.map((key, i) => (
                                            <MenuItem key={i} value={key}>
                                                {
                                                    <FormattedMessage
                                                        id={`app.VehicleType.${VehicleTypes[key]}`}
                                                    />
                                                }
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={sx.row}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    sx={sx.select}
                                >
                                    <InputLabel id="fuel-label">
                                        <FormattedMessage id="app.Fuel" />
                                    </InputLabel>
                                    <Select
                                        labelId="fuel-label"
                                        id="fuel"
                                        value={newVehicle?.fuel || ''}
                                        onChange={(event) =>
                                            changeField(
                                                'fuel',
                                                event.target.value
                                            )
                                        }
                                        label={
                                            <FormattedMessage id="app.Fuel" />
                                        }
                                    >
                                        {!newVehicle?.fuel && (
                                            <MenuItem value={''} disabled>
                                                &#8212;
                                            </MenuItem>
                                        )}
                                        {fuelKeys.map((key, i) => (
                                            <MenuItem key={i} value={key}>
                                                {
                                                    <FormattedMessage
                                                        id={`app.FuelType.${FuelTypes[key]}`}
                                                    />
                                                }
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={sx.row}>
                                <FormControl component="fieldset">
                                    <FormLabel
                                        component="legend"
                                        sx={sx.paddingTop}
                                    >
                                        <FormattedMessage id="app.Units" />
                                    </FormLabel>
                                    <RadioGroup
                                        aria-label="units"
                                        row
                                        name="units"
                                        value={newVehicle?.units}
                                        onChange={(event) =>
                                            changeField(
                                                'units',
                                                event.target.value
                                            )
                                        }
                                    >
                                        <FormControlLabel
                                            value="km"
                                            control={<Radio />}
                                            label={
                                                <FormattedMessage id="app.Kilometers" />
                                            }
                                        />
                                        <FormControlLabel
                                            value="m"
                                            control={<Radio />}
                                            label={
                                                <FormattedMessage id="app.Miles" />
                                            }
                                        />
                                        <FormControlLabel
                                            value="h"
                                            control={<Radio />}
                                            label={
                                                <FormattedMessage id="app.Hours" />
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box sx={sx.paddingTop}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    disabled={
                                        !newVehicle?.name ||
                                        !newVehicle?.type ||
                                        !newVehicle?.fuel ||
                                        !newVehicle?.units
                                    }
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
