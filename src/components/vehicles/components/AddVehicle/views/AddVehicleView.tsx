import {
    Box,
    Typography,
    TextField,
    Modal,
    Paper,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { FormattedMessage, useIntl } from 'react-intl'
import sx from '../styles/AddVehicle.sx'
import { FuelTypes, VehicleTypes } from '../../../types'
import { AddVehicleProps } from '../types'
import { Select as SelectComponent } from '@/components/common/Select/Select'

const AddVehicleView = ({
    open,
    handleClose,
    changeField,
    addVehicle,
    newVehicle,
    newVehicleLoading,
}: AddVehicleProps) => {
    const intl = useIntl()
    const typeKeys = Object.values(VehicleTypes) as Array<VehicleTypes>
    const fuelKeys = Object.values(FuelTypes) as Array<FuelTypes>

    return (
        <Modal open={!!open}>
            <Box sx={sx.wrap}>
                <Paper sx={sx.modal}>
                    <Box
                        component="form"
                        onSubmit={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (
                                !newVehicle?.name ||
                                !newVehicle?.type ||
                                !newVehicle?.fuel ||
                                !newVehicle?.units
                            )
                                return
                            addVehicle()
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={sx.paddingBottom}
                        >
                            <Typography variant="h6">
                                <FormattedMessage id="app.AddVehicle" />
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
                                helperText={
                                    <FormattedMessage id="app.NameExamples" />
                                }
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
                                    onChange={(event) => {
                                        changeField('type', event.target.value)
                                    }}
                                    label={<FormattedMessage id="app.Type" />}
                                >
                                    {!newVehicle?.type && (
                                        <MenuItem value={''} disabled>
                                            &#8212;
                                        </MenuItem>
                                    )}
                                    {typeKeys
                                        .sort((a, b) =>
                                            intl
                                                .formatMessage({
                                                    id: `app.VehicleType.${a}`,
                                                })
                                                .localeCompare(
                                                    intl.formatMessage({
                                                        id: `app.VehicleType.${b}`,
                                                    })
                                                )
                                        )
                                        .map((key, i) => (
                                            <MenuItem key={i} value={key}>
                                                {
                                                    <FormattedMessage
                                                        id={`app.VehicleType.${key}`}
                                                    />
                                                }
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={sx.row}>
                            <SelectComponent
                                items={
                                    typeof newVehicle?.trailer === 'string'
                                        ? [newVehicle?.trailer]
                                        : []
                                }
                                setItems={(trailer) =>
                                    typeof trailer === 'string'
                                        ? changeField('trailer', trailer)
                                        : changeField('trailer', trailer[0])
                                }
                                type="trailers"
                            />
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
                                        changeField('fuel', event.target.value)
                                    }
                                    label={<FormattedMessage id="app.Fuel" />}
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
                                                    id={`app.FuelType.${key}`}
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
                                        changeField('units', event.target.value)
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
                                <FormattedMessage id="app.AddVehicle" />
                            </LoadingButton>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    )
}

export default AddVehicleView
