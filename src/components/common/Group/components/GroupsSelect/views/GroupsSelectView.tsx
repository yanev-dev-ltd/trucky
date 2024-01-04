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
import { Group } from '@/components/common/Group/types'
import Overflow from '@/components/common/Overflow/Overflow'
import { GroupsSelectProps } from '../types'
import { AddGroup } from '@/components/common/Group/components/AddGroup/AddGroup'

const filter = createFilterOptions<Group>()

const GroupsSelectView = ({
    groups,
    setGroups,
    allGroups,
    sx,
    multiple,
    type,
}: GroupsSelectProps) => {
    const intl = useIntl()
    const [open, setOpen] = useState<boolean | string>(false)
    return (
        <>
            <FormControl fullWidth variant="outlined">
                <Autocomplete
                    id="groups"
                    sx={sx}
                    multiple={multiple}
                    options={allGroups as Group[]}
                    value={groups || []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(_, values) => {
                        if (Array.isArray(values))
                            setGroups(values.map((d) => d.key || ''))
                        else if (values?.key) setGroups([values?.key])
                        else setGroups([])
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
                                        id: 'app.Add[Group]',
                                    },
                                    {
                                        group: inputValue,
                                    }
                                ),
                                description: '',
                            })
                        } else {
                            filtered.splice(0, 0, {
                                key: 'new',
                                name: '',
                                description: '',
                                new: intl.formatMessage({
                                    id: 'app.AddGroup',
                                }),
                            })
                        }

                        return filtered
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={<FormattedMessage id="app.Groups" />}
                        />
                    )}
                />
            </FormControl>
            <AddGroup
                open={open}
                type={type}
                setOpen={setOpen}
                onSave={(groupId) =>
                    setGroups(
                        Array.isArray(groups) && multiple
                            ? [...groups.map((g) => g.key || ''), groupId]
                            : [groupId]
                    )
                }
            />
        </>
    )
}

export default GroupsSelectView
