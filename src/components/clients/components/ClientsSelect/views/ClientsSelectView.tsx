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
import { Client } from '@/components/clients/types'
import Overflow from '@/components/common/Overflow/Overflow'
import { ClientsSelectProps } from '../types'
import { AddClient } from '@/components/clients/components/AddClient/AddClient'

const filter = createFilterOptions<Client>()

const ClientsSelectView = ({
    clients,
    setClients,
    allClients,
    sx,
}: ClientsSelectProps) => {
    const intl = useIntl()
    const [open, setOpen] = useState<boolean | string>(false)
    return (
        <>
            <FormControl fullWidth variant="outlined">
                <Autocomplete
                    id="clients"
                    sx={sx}
                    multiple
                    options={allClients as Client[]}
                    value={allClients.filter((c) =>
                        clients?.find((cl) => cl === c.key)
                    )}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(_, values) => {
                        setClients(values.map((d) => d.key))
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
                                new: intl.formatMessage(
                                    {
                                        id: 'app.Add[Client]',
                                    },
                                    {
                                        client: inputValue,
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
                                    id: 'app.AddClient',
                                }),
                            })
                        }

                        return filtered
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={<FormattedMessage id="app.Clients" />}
                        />
                    )}
                />
            </FormControl>
            <AddClient
                open={open}
                setOpen={setOpen}
                onSave={(clientId) =>
                    setClients(
                        Array.isArray(clients)
                            ? [...clients, clientId]
                            : [clientId]
                    )
                }
            />
        </>
    )
}

export default ClientsSelectView
