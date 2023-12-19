import { useState } from 'react'
import {
    Box,
    FormControl,
    TextField,
    Autocomplete,
    Button,
} from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { FormattedMessage, useIntl } from 'react-intl'
import { Vehicle } from '@/components/vehicles/types'
import Overflow from '@/components/common/Overflow/Overflow'
import { VehiclesSelectProps } from '../types'
import { AddVehicle } from '@/components/vehicles/components/AddVehicle/AddVehicle'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const filter = createFilterOptions<Vehicle>()

const VehiclesSelectView = ({
    vehicles,
    setVehicles,
    allVehicles,
    sx,
    multiple,
}: VehiclesSelectProps) => {
    const intl = useIntl()
    const { settings } = useSelector((state: RootState) => state.settings)
    const [open, setOpen] = useState<boolean | string>(false)

    return (
        <>
            <FormControl fullWidth variant="outlined">
                <Autocomplete
                    id="vehicles-select"
                    sx={sx}
                    multiple={multiple}
                    options={allVehicles}
                    value={vehicles || []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(_, values) => {
                        if (Array.isArray(values)) {
                            setVehicles(values.map((v) => v.key))
                        } else if (values?.key) {
                            setVehicles(values.key)
                        } else {
                            setVehicles([])
                        }
                    }}
                    renderOption={(props, option) => (
                        <li
                            {...props}
                            style={{
                                ...(option.new
                                    ? {
                                          padding: 0,
                                      }
                                    : undefined),
                            }}
                            key={option.key}
                        >
                            {option.new ? (
                                <Box
                                    component="span"
                                    sx={{
                                        width: '100%',
                                        padding: 1,
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                >
                                    <Button
                                        size="small"
                                        startIcon={<AddCircle />}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOpen(option.name || true)
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            textTransform: 'none',
                                        }}
                                    >
                                        <Overflow
                                            text={option.new.toString()}
                                        />
                                    </Button>
                                </Box>
                            ) : (
                                option.name
                            )}
                        </li>
                    )}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params)

                        const { inputValue } = params
                        // Suggest the creation of a new value
                        const isExisting = options.some(
                            (option) => inputValue === option.name
                        )
                        if (
                            inputValue !== '' &&
                            !isExisting &&
                            filtered.length === 0
                        ) {
                            filtered.push({
                                key: 'new',
                                name: inputValue,
                                units: settings.units,
                                new: intl.formatMessage(
                                    {
                                        id: 'app.Add[Vehicle]',
                                    },
                                    {
                                        vehicle: inputValue,
                                    }
                                ),
                            })
                        } else {
                            filtered.splice(0, 0, {
                                key: 'new',
                                name: '',
                                units: settings.units,
                                new: intl.formatMessage({
                                    id: 'app.addVehicle',
                                }),
                            })
                        }

                        return filtered
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={
                                <FormattedMessage
                                    id={
                                        multiple
                                            ? 'app.Vehicles'
                                            : 'app.Vehicle'
                                    }
                                />
                            }
                        />
                    )}
                />
            </FormControl>
            <AddVehicle
                open={Boolean(open)}
                setOpen={setOpen}
                onSave={(vehicleId) =>
                    setVehicles(
                        Array.isArray(vehicles) && multiple
                            ? [...vehicles.map((v) => v.key), vehicleId]
                            : vehicleId
                    )
                }
            />
        </>
    )
}

export default VehiclesSelectView
