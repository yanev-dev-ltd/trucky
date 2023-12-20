import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Drawer,
    Paper,
    IconButton,
    Divider,
    TextField,
    Tooltip,
    Autocomplete,
} from '@mui/material'
import { Close, Edit, Delete } from '@mui/icons-material'
import sx from '../styles/EditMaintenance.sx'
import { FormattedMessage, useIntl } from 'react-intl'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { EditMaintenanceProps } from '../types'
import { MaintenanceTypes } from '@/components/maintenance/types'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { DriversSelect } from '@/components/drivers/components/DriversSelect/DriversSelect'

const EditMaintenanceView = ({
    maintenance,
    edit,
    reset,
    saveMaintenanceField,
    setEditedMaintenance,
    editedMaintenance,
    deleteMaintenance,
    onClose,
    onCancel,
    onEdit,
}: EditMaintenanceProps) => {
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const intl = useIntl()
    const [confirmDeleteMaintenance, setConfirmDeleteMaintenance] =
        useState<boolean>(false)

    const drivers = allDrivers.filter((d) =>
        editedMaintenance?.drivers?.find((dr) => dr === d.key)
    )

    return (
        <Drawer
            open={Boolean(maintenance?.key)}
            anchor="right"
            onClose={onClose}
        >
            {!maintenance && (
                <Box display="flex" justifyContent="center" p={2} sx={sx.wrap}>
                    <IconButton size="small" sx={sx.edit} onClick={onClose}>
                        <Close />
                    </IconButton>
                    <Typography>
                        <FormattedMessage id="app.MaintenanceNotFound" />
                    </Typography>
                </Box>
            )}
            {maintenance && (
                <Box sx={sx.wrap}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.Details" />
                        </Typography>
                        <IconButton size="small" onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Paper sx={sx.paper}>
                        {edit !== 'type' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Type" />
                                </Typography>
                                <Overflow
                                    text={maintenance?.type || '-'}
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('type')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'type' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('type')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Type" />
                                </Typography>
                                <Autocomplete
                                    value={maintenance?.type || ''}
                                    onChange={(event, newValue) => {
                                        setEditedMaintenance({
                                            ...maintenance,
                                            type: newValue || '',
                                        })
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
                                                setEditedMaintenance({
                                                    ...maintenance,
                                                    type:
                                                        event.target.value ||
                                                        '',
                                                })
                                            }
                                        />
                                    )}
                                    freeSolo
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.type ===
                                            editedMaintenance?.type ||
                                        !editedMaintenance?.type
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'description' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Description" />
                                </Typography>
                                <Box
                                    component="pre"
                                    sx={{
                                        textWrap: 'wrap',
                                    }}
                                >
                                    <Typography variant="h6">
                                        {maintenance?.description || '-'}
                                    </Typography>
                                </Box>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('description')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'description' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('description')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Description" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    value={editedMaintenance?.description || ''}
                                    onChange={(event) =>
                                        setEditedMaintenance({
                                            ...maintenance,
                                            description:
                                                event.target.value || '',
                                        })
                                    }
                                    fullWidth
                                    multiline
                                    maxRows={8}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.description ===
                                            editedMaintenance?.description ||
                                        !editedMaintenance?.description
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'part' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.RepairedPart" />
                                </Typography>
                                <Overflow
                                    text={maintenance?.part || '-'}
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('part')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'part' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('part')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.RepairedPart" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    value={editedMaintenance?.part || ''}
                                    onChange={(event) =>
                                        setEditedMaintenance({
                                            ...maintenance,
                                            part: event.target.value || '',
                                        })
                                    }
                                    fullWidth
                                    multiline
                                    maxRows={8}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.part ===
                                            editedMaintenance?.part ||
                                        !editedMaintenance?.part
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'reminderMileage' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.ReminderMileage" />
                                </Typography>
                                <Overflow
                                    text={maintenance?.reminderMileage || '-'}
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('reminderMileage')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'reminderMileage' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('reminderMileage')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.ReminderMileage" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    helperText={
                                        <FormattedMessage
                                            id="app.ReminderInfo"
                                            values={{
                                                units: intl
                                                    .formatMessage({
                                                        id:
                                                            maintenance.units ===
                                                            'km'
                                                                ? 'app.Kilometers'
                                                                : maintenance.units ===
                                                                  'm'
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
                                                    maintenance.units === 'km'
                                                        ? 'app.Km'
                                                        : maintenance.units ===
                                                          'm'
                                                        ? 'app.Mi'
                                                        : 'app.Hrs'
                                                }
                                            />
                                        ),
                                    }}
                                    value={
                                        editedMaintenance?.reminderMileage || ''
                                    }
                                    onChange={(event) =>
                                        setEditedMaintenance({
                                            ...maintenance,
                                            reminderMileage:
                                                +event.target.value || null,
                                        })
                                    }
                                    fullWidth
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.reminderMileage ===
                                        editedMaintenance?.reminderMileage
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'reminderDate' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.ReminderDate" />
                                </Typography>
                                <Overflow
                                    text={
                                        maintenance?.reminderDate
                                            ? format(
                                                  new Date(
                                                      +maintenance?.reminderDate
                                                  ),
                                                  'dd/MM/yyyy'
                                              )
                                            : '-'
                                    }
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('reminderDate')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'reminderDate' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('reminderDate')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.ReminderDate" />
                                </Typography>
                                <DesktopDatePicker
                                    inputFormat="dd/MM/yyyy"
                                    value={
                                        Number(
                                            editedMaintenance?.reminderDate
                                        ) || null
                                    }
                                    onChange={(d: Date | null) =>
                                        d &&
                                        setEditedMaintenance({
                                            ...maintenance,
                                            reminderDate: d.getTime() || null,
                                        })
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
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.reminderDate ===
                                        editedMaintenance?.reminderDate
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'date' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Date" />
                                </Typography>
                                <Overflow
                                    text={
                                        maintenance?.date
                                            ? format(
                                                  new Date(+maintenance?.date),
                                                  'dd/MM/yyyy'
                                              )
                                            : '-'
                                    }
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('date')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'date' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('date')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Date" />
                                </Typography>
                                <DesktopDatePicker
                                    inputFormat="dd/MM/yyyy"
                                    value={
                                        Number(editedMaintenance?.date) || null
                                    }
                                    onChange={(d: Date | null) =>
                                        d &&
                                        setEditedMaintenance({
                                            ...maintenance,
                                            date: d.getTime() || null,
                                        })
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
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.date ===
                                        editedMaintenance?.date
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'cost' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Cost" />
                                </Typography>
                                <Overflow
                                    text={maintenance?.cost || '-'}
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('cost')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'cost' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('cost')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Cost" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    value={editedMaintenance?.cost || ''}
                                    onChange={(event) =>
                                        setEditedMaintenance({
                                            ...maintenance,
                                            cost: event.target.value || '',
                                        })
                                    }
                                    fullWidth
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.cost ===
                                        editedMaintenance?.cost
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'place' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.PlaceMaintenance" />
                                </Typography>
                                <Overflow
                                    text={maintenance?.place || '-'}
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('place')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'place' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('place')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.PlaceMaintenance" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    value={editedMaintenance?.place || ''}
                                    onChange={(event) =>
                                        setEditedMaintenance({
                                            ...maintenance,
                                            place: event.target.value || '',
                                        })
                                    }
                                    fullWidth
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.place ===
                                        editedMaintenance?.place
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'drivers' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Drivers" />
                                </Typography>
                                {!drivers || drivers.length === 0 ? (
                                    '-'
                                ) : drivers.length === 1 ? (
                                    <Box>
                                        <Overflow
                                            variant="h6"
                                            text={drivers[0]?.name || '-'}
                                        />
                                        {drivers[0]?.phone && (
                                            <Overflow
                                                variant="caption"
                                                text={drivers[0]?.phone}
                                            />
                                        )}
                                    </Box>
                                ) : (
                                    <Overflow
                                        variant="h6"
                                        text={drivers
                                            .map((d) => d.name)
                                            .join(', ')}
                                    />
                                )}
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            onEdit('drivers')
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'drivers' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveMaintenanceField('drivers')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Drivers" />
                                </Typography>
                                <DriversSelect
                                    multiple
                                    drivers={editedMaintenance?.drivers || []}
                                    setDrivers={(drivers) =>
                                        setEditedMaintenance({
                                            ...maintenance,
                                            drivers,
                                        })
                                    }
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        maintenance.drivers ===
                                        editedMaintenance?.drivers
                                    }
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            onCancel()
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Divider />
                    <LoadingButton
                        sx={sx.warn}
                        onClick={() => setConfirmDeleteMaintenance(true)}
                        startIcon={<Delete />}
                        color="secondary"
                        fullWidth
                    >
                        <FormattedMessage id="app.DeleteMaintenance" />
                    </LoadingButton>
                    <Confirm
                        onCancel={() => setConfirmDeleteMaintenance(false)}
                        onSubmit={() => {
                            deleteMaintenance()
                            setConfirmDeleteMaintenance(false)
                        }}
                        isOpen={confirmDeleteMaintenance}
                        message={
                            <FormattedMessage
                                id="app.Deleting"
                                values={{
                                    name: (
                                        <Overflow
                                            text={maintenance.type || ''}
                                        />
                                    ),
                                }}
                            />
                        }
                        type="warn"
                        submit={<FormattedMessage id="app.Delete" />}
                        cancel={<FormattedMessage id="app.Cancel" />}
                    />
                </Box>
            )}
        </Drawer>
    )
}

export default EditMaintenanceView
