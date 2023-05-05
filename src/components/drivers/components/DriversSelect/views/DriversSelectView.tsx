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
import { Driver } from '@/components/drivers/types'
import Overflow from '@/components/common/Overflow/Overflow'
import { DriversSelectProps } from '../types'
import { AddDriver } from '@/components/drivers/components/AddDriver/AddDriver'

const filter = createFilterOptions<Driver>()

const DriversSelectView = ({
    drivers,
    setDrivers,
    allDrivers,
    sx,
}: DriversSelectProps) => {
    const intl = useIntl()
    const [open, setOpen] = useState<boolean | string>(false)
    return (
        <>
            <FormControl fullWidth variant="outlined">
                <Autocomplete
                    id="drivers"
                    sx={sx}
                    multiple
                    options={allDrivers as Driver[]}
                    value={allDrivers.filter((d) =>
                        drivers?.find((dr) => dr === d.key)
                    )}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(_, values) => {
                        setDrivers(values.map((d) => d.key))
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
                                new: intl.formatMessage(
                                    {
                                        id: 'app.Add[Driver]',
                                    },
                                    {
                                        driver: inputValue,
                                    }
                                ),
                                phone: '',
                            })
                        } else {
                            filtered.splice(0, 0, {
                                key: 'new',
                                name: '',
                                phone: '',
                                new: intl.formatMessage({
                                    id: 'app.AddDriver',
                                }),
                            })
                        }

                        return filtered
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={<FormattedMessage id="app.Drivers" />}
                        />
                    )}
                />
            </FormControl>
            <AddDriver
                open={open}
                setOpen={setOpen}
                onSave={(driverId) =>
                    setDrivers(
                        Array.isArray(drivers)
                            ? [...drivers, driverId]
                            : [driverId]
                    )
                }
            />
        </>
    )
}

export default DriversSelectView
