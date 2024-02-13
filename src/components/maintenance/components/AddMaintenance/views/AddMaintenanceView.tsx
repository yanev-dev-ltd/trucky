import {
    Dialog,
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Tooltip,
    IconButton,
    Autocomplete,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment,
} from '@mui/material'
import { AddCircle, Add } from '@mui/icons-material'

import { FormattedMessage, useIntl } from 'react-intl'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

import sx from '../styles/AddMaintenance.sx'
import { AddMaintenanceProps } from '../types'
import { MaintenanceTypes } from '@/components/maintenance/types'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import TextareaAutoSize from '@/components/common/TextareaAutoSize/TextAreaAutoSize'
import { Select } from '@/components/common/Select/Select'
import currencies from '@/api/currencies.json'
import { Currencies } from '@/components/settings/components/Currency/Currency'
import { Documents } from '@/components/common/Documents/Documents'

const AddMaintenanceView = ({
    units,
    vehicleId,
    setField,
    maintenance,
    fullButton,
    handleOpen,
    handleClose,
    handleSubmit,
    newMaintenanceOpen,
}: AddMaintenanceProps) => {
    const intl = useIntl()
    const { settings } = useSelector((state: RootState) => state.settings)
    const [isTrailer, setIsTrailer] = useState<boolean>(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsTrailer((event.target as HTMLInputElement).value === 'true')
    }

    return (
        <>
            {fullButton ? (
                <Tooltip title="ctrl + N">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleOpen}
                        style={{ marginLeft: 'auto' }}
                    >
                        <FormattedMessage id="app.AddMaintenance" />
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip
                    title={<FormattedMessage id="app.AddMaintenance" />}
                    sx={sx.button}
                >
                    <IconButton size="small" onClick={handleOpen}>
                        <AddCircle />
                    </IconButton>
                </Tooltip>
            )}
            <Dialog
                open={Boolean(newMaintenanceOpen)}
                onClose={() => handleClose(true)}
                aria-labelledby="new-maintenance-dialog-title"
                maxWidth="sm"
            >
                <Box sx={sx.form}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogTitle id="new-maintenance-dialog-title">
                            <FormattedMessage id="app.AddMaintenance" />
                        </DialogTitle>
                        <DialogContent>
                            {!vehicleId && (
                                <>
                                    <Box sx={sx.row}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                value={isTrailer}
                                                onChange={handleChange}
                                            >
                                                <FormControlLabel
                                                    value={false}
                                                    control={<Radio />}
                                                    label={
                                                        <FormattedMessage id="app.Vehicle" />
                                                    }
                                                />
                                                <FormControlLabel
                                                    value={true}
                                                    control={<Radio />}
                                                    label={
                                                        <FormattedMessage id="app.Trailer" />
                                                    }
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                    <Box sx={sx.row}>
                                        <Select
                                            items={[
                                                maintenance.vehicleId || '',
                                            ]}
                                            setItems={(item) => {
                                                setField(
                                                    'vehicleId',
                                                    typeof item === 'string'
                                                        ? item
                                                        : item?.[0]
                                                )
                                                setField(
                                                    'isTrailer',
                                                    isTrailer ? 'true' : ''
                                                )
                                            }}
                                            type={
                                                isTrailer
                                                    ? 'trailers'
                                                    : 'vehicles'
                                            }
                                        />
                                    </Box>
                                </>
                            )}
                            <Box sx={sx.row}>
                                <Autocomplete
                                    value={maintenance?.type || ''}
                                    onChange={(event, newValue) => {
                                        setField('type', newValue)
                                    }}
                                    options={[
                                        ...Object.values(MaintenanceTypes).map(
                                            (type) =>
                                                intl.formatMessage({
                                                    id: `app.MaintenanceType.${type}`,
                                                })
                                        ),
                                    ]}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            onChange={(event) =>
                                                setField(
                                                    'type',
                                                    event.target.value
                                                )
                                            }
                                            label={
                                                <FormattedMessage id="app.Type" />
                                            }
                                        />
                                    )}
                                    freeSolo
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.Description" />
                                    }
                                    value={maintenance.description || ''}
                                    onChange={(event) =>
                                        setField(
                                            'description',
                                            event.target.value
                                        )
                                    }
                                    fullWidth
                                    multiline
                                    maxRows={8}
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.RepairedPart" />
                                    }
                                    value={maintenance.part || ''}
                                    onChange={(event) =>
                                        setField('part', event.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.ReminderMileage" />
                                    }
                                    helperText={
                                        <FormattedMessage
                                            id="app.ReminderInfo"
                                            values={{
                                                units: intl
                                                    .formatMessage({
                                                        id:
                                                            units === 'km'
                                                                ? 'app.Kilometers'
                                                                : units === 'm'
                                                                ? 'app.Miles'
                                                                : 'app.Hours',
                                                    })
                                                    .toLowerCase(),
                                            }}
                                        />
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <FormattedMessage
                                                id={
                                                    units === 'km'
                                                        ? 'app.Km'
                                                        : units === 'm'
                                                        ? 'app.Mi'
                                                        : 'app.Hrs'
                                                }
                                            />
                                        ),
                                    }}
                                    value={maintenance.reminderMileage || ''}
                                    onChange={(event) =>
                                        setField(
                                            'reminderMileage',
                                            event.target.value
                                        )
                                    }
                                    fullWidth
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <DesktopDatePicker
                                    label={
                                        <FormattedMessage id="app.ReminderDate" />
                                    }
                                    inputFormat="dd/MM/yyyy"
                                    value={maintenance.reminderDate || null}
                                    onChange={(d: Date | null) =>
                                        d &&
                                        setField('reminderDate', d.getTime())
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            helperText={
                                                <FormattedMessage id="app.ReminderInfoDate" />
                                            }
                                            inputProps={{
                                                ...params.inputProps,
                                                placeholder:
                                                    intl.formatMessage({
                                                        id: 'app.dd/MM/yyyy',
                                                    }) || '',
                                            }}
                                        />
                                    )}
                                    disablePast
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <DesktopDatePicker
                                    label={<FormattedMessage id="app.Date" />}
                                    inputFormat="dd/MM/yyyy"
                                    value={
                                        maintenance.date || new Date().getTime()
                                    }
                                    onChange={(d: Date | null) =>
                                        d && setField('date', d?.getTime())
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            inputProps={{
                                                ...params.inputProps,
                                                placeholder:
                                                    intl.formatMessage({
                                                        id: 'app.dd/MM/yyyy',
                                                    }) || '',
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Cost" />}
                                    value={maintenance.cost || ''}
                                    onChange={(event) =>
                                        setField('cost', event.target.value)
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {
                                                    (currencies as Currencies)[
                                                        settings.currency ||
                                                            'EUR'
                                                    ].symbol
                                                }
                                            </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.PlaceMaintenance" />
                                    }
                                    value={maintenance.place || ''}
                                    onChange={(event) =>
                                        setField('place', event.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <Select
                                    items={maintenance.drivers || []}
                                    setItems={(drivers) =>
                                        setField('drivers', drivers)
                                    }
                                    type="drivers"
                                    multiple
                                />
                            </Box>
                            <Documents
                                type="maintenance"
                                typeId={newMaintenanceOpen || ''}
                                light
                            />
                            <Box sx={sx.row}>
                                <TextareaAutoSize
                                    value={maintenance?.notes || ''}
                                    placeholder={intl.formatMessage({
                                        id: 'app.Notes',
                                    })}
                                    onChange={(event) =>
                                        setField('notes', event.target.value)
                                    }
                                    maxRows={16}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleClose(true)}>
                                <FormattedMessage id="app.Cancel" />
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                disabled={
                                    !maintenance.type || !maintenance.vehicleId
                                }
                            >
                                <FormattedMessage id="app.Save" />
                            </Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}

export default AddMaintenanceView
