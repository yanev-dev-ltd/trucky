import {
    Dialog,
    Box,
    DialogContent,
    Typography,
    FormControl,
    TextField,
    Autocomplete,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { FormattedMessage, useIntl } from 'react-intl'
import { Driver } from '@/components/drivers/types'
import Overflow from '@/components/common/Overflow/Overflow'
import { DriversSelectProps } from '../types'

const filter = createFilterOptions<Driver>()

const DriversSelectView = ({
    drivers,
    setDrivers,
    allDrivers,
}: DriversSelectProps) => {
    const intl = useIntl()
    return (
        <FormControl fullWidth variant="outlined">
            <Autocomplete
                id="drivers"
                multiple
                options={allDrivers as Driver[]}
                value={allDrivers.filter((d) =>
                    drivers?.find((dr) => dr === d.id)
                )}
                getOptionLabel={(option) => option.name}
                onChange={(_, values) => {
                    setDrivers(values.map((d) => d.id))
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
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none',
                                    }}
                                >
                                    <Overflow text={option.new.toString()} />
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
                            id: 'new',
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
                            id: 'new',
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
    )
}

export default DriversSelectView
