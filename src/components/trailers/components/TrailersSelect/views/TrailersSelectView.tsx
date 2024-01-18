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
import Overflow from '@/components/common/Overflow/Overflow'
import { TrailersSelectProps } from '../types'
import { AddTrailer } from '@/components/trailers/components/AddTrailer/AddTrailer'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Trailer } from '@/components/trailers/types'

const filter = createFilterOptions<Trailer>()

const TrailersSelectView = ({
    trailers,
    setTrailers,
    allTrailers,
    sx,
    multiple,
    type,
}: TrailersSelectProps) => {
    const intl = useIntl()
    const { settings } = useSelector((state: RootState) => state.settings)
    const [open, setOpen] = useState<boolean | string>(false)

    return (
        <>
            <FormControl fullWidth variant="outlined">
                <Autocomplete
                    id="trailers-select"
                    sx={sx}
                    multiple={multiple}
                    options={
                        type
                            ? allTrailers.filter((t) => t.type === type)
                            : allTrailers
                    }
                    value={trailers || []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(_, values) => {
                        if (Array.isArray(values)) {
                            setTrailers(values.map((v) => v.key))
                        } else if (values?.key) {
                            setTrailers(values.key)
                        } else {
                            setTrailers([])
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
                                        id: 'app.Add[Trailer]',
                                    },
                                    {
                                        trailer: inputValue,
                                    }
                                ),
                            })
                        } else {
                            filtered.splice(0, 0, {
                                key: 'new',
                                name: '',
                                units: settings.units,
                                new: intl.formatMessage({
                                    id: 'app.AddTrailer',
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
                                        type
                                            ? `app.TrailerType.${type}`
                                            : multiple
                                            ? 'app.Trailers'
                                            : 'app.Trailer'
                                    }
                                />
                            }
                        />
                    )}
                />
            </FormControl>
            <AddTrailer
                open={Boolean(open)}
                setOpen={setOpen}
                onSave={(trailerId) =>
                    setTrailers(
                        Array.isArray(trailers) && multiple
                            ? [...trailers.map((t) => t.key), trailerId]
                            : trailerId
                    )
                }
            />
        </>
    )
}

export default TrailersSelectView
