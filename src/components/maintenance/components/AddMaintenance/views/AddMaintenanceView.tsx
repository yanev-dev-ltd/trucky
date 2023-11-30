import { useState, useCallback, SyntheticEvent } from 'react'
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
} from '@mui/material'
import { AddCircle, Add } from '@mui/icons-material'

import { FormattedMessage, useIntl } from 'react-intl'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

import sx from '../styles/AddMaintenance.sx'
import { AddMaintenanceProps } from '../types'
import { DriversSelect } from '@/components/drivers/components/DriversSelect/DriversSelect'
import { MaintenanceTypes } from '@/components/maintenance/types'
import { VehiclesSelect } from '@/components/vehicles/components/VehiclesSelect/VehiclesSelect'

const AddMaintenanceView = ({
    addMaintenance,
    units,
    vehicleId,
    setField,
    maintenance,
    reset,
    fullButton,
}: AddMaintenanceProps) => {
    const intl = useIntl()
    const [newMaintenanceOpen, setNewMaintenanceOpen] = useState(false)

    const handleNewMaintenanceOpen = useCallback(() => {
        setNewMaintenanceOpen(true)
    }, [])

    const handleNewMaintenanceClose = useCallback(() => {
        setNewMaintenanceOpen(false)
    }, [])

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
        addMaintenance && addMaintenance(maintenance)
        handleClose()
    }

    const handleClose = () => {
        reset()
        handleNewMaintenanceClose && handleNewMaintenanceClose()
    }

    return (
        <>
            {fullButton ? (
                <Tooltip title="ctrl + N">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleNewMaintenanceOpen}
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
                    <IconButton size="small" onClick={handleNewMaintenanceOpen}>
                        <AddCircle />
                    </IconButton>
                </Tooltip>
            )}
            <Dialog
                open={newMaintenanceOpen}
                onClose={handleClose}
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
                                <Box sx={sx.row}>
                                    <VehiclesSelect
                                        vehicles={[maintenance.vehicleId || '']}
                                        setVehicles={(vehicle) =>
                                            setField('vehicleId', vehicle)
                                        }
                                    />
                                </Box>
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
                                <DriversSelect
                                    drivers={maintenance.drivers || []}
                                    setDrivers={(drivers) =>
                                        setField('drivers', drivers)
                                    }
                                    multiple
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>
                                <FormattedMessage id="app.Cancel" />
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                disabled={!maintenance.type}
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
