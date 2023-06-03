import { useState, SyntheticEvent } from 'react'
import {
    Dialog,
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from '@mui/material'
import { Delete } from '@mui/icons-material'

import { FormattedMessage, useIntl } from 'react-intl'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

import sx from './styles/EditService.sx'
import { EditServiceProps } from './types'
import useEditService from './hooks/useEditService'
import LoadingButton from '../../../../../common/LoadingButton/LoadingButton'
import Confirm from '../../../../../common/Confirm/Confirm'
import Overflow from '../../../../../common/Overflow/Overflow'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { DriversSelect } from '@/components/drivers/components/DriversSelect/DriversSelect'

const EditService = ({
    service,
    handleEditServiceClose,
    units,
}: EditServiceProps) => {
    const intl = useIntl()
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const [confirmDeleteService, setConfirmDeleteService] =
        useState<boolean>(false)
    const { editedService, setField, saveService, deleteService } =
        useEditService(service)

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
        saveService && saveService()
        handleEditServiceClose()
    }

    return (
        <Dialog
            open={Boolean(service)}
            onClose={handleEditServiceClose}
            aria-labelledby="new-service-dialog-title"
            maxWidth="sm"
        >
            <Box sx={sx.form}>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle id="new-service-dialog-title">
                        <FormattedMessage id="app.EditService" />
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={sx.row}>
                            <TextField
                                variant="outlined"
                                label={<FormattedMessage id="app.Type" />}
                                value={editedService?.type || ''}
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
                                value={editedService?.part || ''}
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
                                value={editedService?.reminderMileage || ''}
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
                                value={editedService?.reminderDate || null}
                                onChange={(d: Date | null) =>
                                    d && setField('reminderDate', d.getTime())
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        helperText={
                                            <FormattedMessage id="app.ReminderInfoDate" />
                                        }
                                        inputProps={{
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
                                    editedService?.date || new Date().getTime()
                                }
                                onChange={(d: Date | null) =>
                                    d && setField('date', d?.getTime())
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        inputProps={{
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
                                value={editedService?.cost || ''}
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
                                value={editedService?.place || ''}
                                onChange={(event) =>
                                    setField('place', event.target.value)
                                }
                                fullWidth
                            />
                        </Box>
                        <Box sx={sx.row}>
                            <DriversSelect
                                drivers={editedService?.drivers || []}
                                setDrivers={(drivers) =>
                                    setField('drivers', drivers)
                                }
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton
                            sx={sx.warn}
                            onClick={() => setConfirmDeleteService(true)}
                            startIcon={<Delete />}
                            color="secondary"
                        >
                            <FormattedMessage id="app.Delete" />
                        </LoadingButton>
                        <Confirm
                            onCancel={() => setConfirmDeleteService(false)}
                            onSubmit={() => {
                                deleteService()
                                handleEditServiceClose()
                                setConfirmDeleteService(false)
                            }}
                            isOpen={confirmDeleteService}
                            message={
                                <FormattedMessage
                                    id="app.Deleting"
                                    values={{
                                        name: (
                                            <Overflow
                                                text={editedService?.type || ''}
                                            />
                                        ),
                                    }}
                                />
                            }
                            type="warn"
                            submit={<FormattedMessage id="app.Delete" />}
                            cancel={<FormattedMessage id="app.Cancel" />}
                        />
                        <Button onClick={handleEditServiceClose}>
                            <FormattedMessage id="app.Cancel" />
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={!editedService?.type}
                        >
                            <FormattedMessage id="app.EditService" />
                        </Button>
                    </DialogActions>
                </Box>
            </Box>
        </Dialog>
    )
}

export default EditService
