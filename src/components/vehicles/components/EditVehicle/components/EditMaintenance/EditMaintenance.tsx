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

import sx from './styles/EditMaintenance.sx'
import { EditMaintenanceProps } from './types'
import useEditMaintenance from './hooks/useEditMaintenance'
import LoadingButton from '../../../../../common/LoadingButton/LoadingButton'
import Confirm from '../../../../../common/Confirm/Confirm'
import Overflow from '../../../../../common/Overflow/Overflow'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { DriversSelect } from '@/components/drivers/components/DriversSelect/DriversSelect'

const EditMaintenance = ({
    maintenance,
    handleEditMaintenanceClose,
    units,
}: EditMaintenanceProps) => {
    const intl = useIntl()
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const [confirmDeleteMaintenance, setConfirmDeleteMaintenance] =
        useState<boolean>(false)
    const { editedMaintenance, setField, saveMaintenance, deleteMaintenance } =
        useEditMaintenance(maintenance)

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
        saveMaintenance && saveMaintenance()
        handleEditMaintenanceClose()
    }
    return (
        <Dialog
            open={Boolean(maintenance)}
            onClose={handleEditMaintenanceClose}
            aria-labelledby="new-maintenance-dialog-title"
            maxWidth="sm"
        >
            <Box sx={sx.form}>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle id="new-maintenance-dialog-title">
                        <FormattedMessage id="app.EditMaintenance" />
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={sx.row}>
                            <TextField
                                variant="outlined"
                                label={<FormattedMessage id="app.Type" />}
                                value={editedMaintenance?.type || ''}
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
                                value={editedMaintenance?.part || ''}
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
                                value={editedMaintenance?.reminderMileage || ''}
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
                                value={
                                    Number(editedMaintenance?.reminderDate) ||
                                    null
                                }
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
                                        InputLabelProps={{
                                            shrink: !!editedMaintenance?.reminderDate,
                                        }}
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
                                value={editedMaintenance?.date || null}
                                onChange={(d: Date | null) =>
                                    d && setField('date', d?.getTime())
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: !!editedMaintenance?.date,
                                        }}
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
                                value={editedMaintenance?.cost || ''}
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
                                value={editedMaintenance?.place || ''}
                                onChange={(event) =>
                                    setField('place', event.target.value)
                                }
                                fullWidth
                            />
                        </Box>
                        <Box sx={sx.row}>
                            <DriversSelect
                                drivers={editedMaintenance?.drivers || []}
                                setDrivers={(drivers) =>
                                    setField('drivers', drivers)
                                }
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton
                            sx={sx.warn}
                            onClick={() => setConfirmDeleteMaintenance(true)}
                            startIcon={<Delete />}
                            color="secondary"
                        >
                            <FormattedMessage id="app.Delete" />
                        </LoadingButton>
                        <Confirm
                            onCancel={() => setConfirmDeleteMaintenance(false)}
                            onSubmit={() => {
                                deleteMaintenance()
                                handleEditMaintenanceClose()
                                setConfirmDeleteMaintenance(false)
                            }}
                            isOpen={confirmDeleteMaintenance}
                            message={
                                <FormattedMessage
                                    id="app.Deleting"
                                    values={{
                                        name: (
                                            <Overflow
                                                text={
                                                    editedMaintenance?.type ||
                                                    ''
                                                }
                                            />
                                        ),
                                    }}
                                />
                            }
                            type="warn"
                            submit={<FormattedMessage id="app.Delete" />}
                            cancel={<FormattedMessage id="app.Cancel" />}
                        />
                        <Button onClick={handleEditMaintenanceClose}>
                            <FormattedMessage id="app.Cancel" />
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={!editedMaintenance?.type}
                        >
                            <FormattedMessage id="app.Save" />
                        </Button>
                    </DialogActions>
                </Box>
            </Box>
        </Dialog>
    )
}

export default EditMaintenance
