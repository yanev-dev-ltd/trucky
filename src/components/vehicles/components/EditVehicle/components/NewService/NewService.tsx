import { useState, useCallback, SyntheticEvent } from 'react'
import {
    Dialog,
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Button,
    TextField,
    Tooltip,
    IconButton,
} from '@mui/material'
import { AddCircle } from '@mui/icons-material'

import { FormattedMessage, useIntl } from 'react-intl'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

import sx from './styles/NewService.sx'
import { NewServiceProps } from './types'
import useNewService from './hooks/useNewService'
import { DriversSelect } from '@/components/common/DriversSelect/DriversSelect'

const NewService = ({ addService, drivers, units }: NewServiceProps) => {
    const intl = useIntl()
    const [newServiceOpen, setNewServiceOpen] = useState(false)
    const { setField, service, reset } = useNewService()

    const handleNewServiceOpen = useCallback(() => {
        setNewServiceOpen(true)
    }, [])

    const handleNewServiceClose = useCallback(() => {
        setNewServiceOpen(false)
    }, [])

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
        addService && addService(service)
        handleClose()
    }

    const handleClose = () => {
        reset()
        handleNewServiceClose && handleNewServiceClose()
    }

    return (
        <>
            <Tooltip
                title={<FormattedMessage id="app.AddService" />}
                sx={sx.button}
            >
                <IconButton size="small" onClick={handleNewServiceOpen}>
                    <AddCircle />
                </IconButton>
            </Tooltip>
            <Dialog
                open={newServiceOpen}
                onClose={handleClose}
                aria-labelledby="new-service-dialog-title"
                maxWidth="sm"
            >
                <Box sx={sx.form}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogTitle id="new-service-dialog-title">
                            <FormattedMessage id="app.AddService" />
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Type" />}
                                    value={service.type || ''}
                                    onChange={(event) =>
                                        setField('type', event.target.value)
                                    }
                                    fullWidth
                                    helperText={
                                        <FormattedMessage id="app.TypeExamples" />
                                    }
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.RepairedPart" />
                                    }
                                    value={service.part || ''}
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
                                    value={service.reminderMileage || ''}
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
                                    value={service.reminderDate || null}
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
                                        />
                                    )}
                                    disablePast
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <DesktopDatePicker
                                    label={<FormattedMessage id="app.Date" />}
                                    inputFormat="dd/MM/yyyy"
                                    value={service.date || new Date().getTime()}
                                    onChange={(d: Date | null) =>
                                        d && setField('date', d?.getTime())
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth />
                                    )}
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Cost" />}
                                    value={service.cost || ''}
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
                                        <FormattedMessage id="app.PlaceService" />
                                    }
                                    value={service.place || ''}
                                    onChange={(event) =>
                                        setField('place', event.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                            <Box sx={sx.row}>
                                <DriversSelect
                                    drivers={service.drivers || []}
                                    setDrivers={(drivers) =>
                                        setField(
                                            'drivers',
                                            drivers.map((dr) => dr.id)
                                        )
                                    }
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
                                disabled={!service.type}
                            >
                                <FormattedMessage id="app.AddService" />
                            </Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}

export default NewService
