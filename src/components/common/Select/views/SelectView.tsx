import { useState } from 'react'
import {
    Box,
    FormControl,
    TextField,
    Autocomplete,
    Button,
    ListItem,
    ListItemText,
} from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { FormattedMessage, useIntl } from 'react-intl'
import Overflow from '@/components/common/Overflow/Overflow'
import { SelectProps, SelectItem } from '../types'
import { capitalizeFirstLetter } from '@/utils/globalUtils'

const filter = createFilterOptions<SelectItem>()
const SelectView = ({
    items,
    setItems,
    allItems,
    sx,
    multiple,
    type,
    AddItem,
}: SelectProps) => {
    const intl = useIntl()
    const [open, setOpen] = useState<boolean | string>(false)
    return (
        <>
            <FormControl fullWidth variant="outlined">
                <Autocomplete
                    id={`${type}-select`}
                    sx={sx}
                    multiple={multiple}
                    options={allItems as SelectItem[]}
                    value={items || []}
                    getOptionLabel={(option) => option?.name || ''}
                    onChange={(_, values) => {
                        if (Array.isArray(values))
                            setItems(values.map((v) => v?.key || ''))
                        else if (values) setItems([values.key])
                        else setItems([])
                    }}
                    renderOption={(props, option) => (
                        <ListItem
                            {...props}
                            style={{
                                ...(option?.new
                                    ? {
                                          padding: 0,
                                      }
                                    : undefined),
                            }}
                            key={option?.key}
                        >
                            {option?.new ? (
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
                                <ListItemText primary={option?.name} />
                            )}
                        </ListItem>
                    )}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params)

                        const { inputValue } = params
                        // Suggest the creation of a new value
                        const isExisting = options.some(
                            (option) => inputValue === option?.name
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
                                        id: `app.Add[${capitalizeFirstLetter(
                                            type
                                        ).slice(0, -1)}]`,
                                    },
                                    {
                                        item: inputValue,
                                    }
                                ),
                            })
                        } else {
                            filtered.splice(0, 0, {
                                key: 'new',
                                name: '',
                                new: intl.formatMessage({
                                    id: `app.Add${capitalizeFirstLetter(
                                        type
                                    ).slice(0, -1)}`,
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
                                    id={`app.${capitalizeFirstLetter(type)}`}
                                />
                            }
                        />
                    )}
                />
            </FormControl>
            {AddItem && (
                <AddItem
                    open={open}
                    setOpen={setOpen}
                    onSave={(itemId) =>
                        setItems(
                            Array.isArray(items) && multiple
                                ? [...items.map((i) => i?.key || ''), itemId]
                                : [itemId]
                        )
                    }
                />
            )}
        </>
    )
}

export default SelectView
