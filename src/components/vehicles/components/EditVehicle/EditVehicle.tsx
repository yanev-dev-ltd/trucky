import { useState, useCallback, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    Drawer,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Divider,
    TextField,
    Tooltip,
    CircularProgress,
} from '@mui/material'
import {
    Close,
    Edit,
    AddCircle,
    Visibility,
    Delete,
    Route as RouteIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { bg, enUS } from 'date-fns/locale'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { FormattedMessage } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import sx from './styles/EditVehicle.sx'
import { EditVehicleProps } from './types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import useEditVehicle from './hooks/useEditVehicle'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import { AddMaintenance } from '@/components/maintenance/components/AddMaintenance/AddMaintenance'
import { EditMaintenance } from '@/components/maintenance/components/EditMaintenance/EditMaintenance'
import Route from '@/components/routes/components/Route/Route'
import { GroupsSelect } from '@/components/common/Group/components/GroupsSelect/GroupsSelect'
import TextareaAutoSize from '@/components/common/TextareaAutoSize/TextAreaAutoSize'
import { Select } from '@/components/common/Select/Select'
import { Documents } from '@/components/common/Documents/Documents'
import MaintenanceStatus from '@/components/maintenance/components/MaintenanceStatus/MaintenanceStatus'

const EditVehicle = ({ vehicle, edit, routeId }: EditVehicleProps) => {
    const router = useRouter()
    const {
        saveVehicleField,
        editedVehicle,
        setEditedVehicle,
        reset,
        deleteVehicle,
        maintenances,
        routes,
    } = useEditVehicle(vehicle)
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const allTrailers = useSelector((state: RootState) => state.trailers)
    const allGroups = useSelector((state: RootState) => state.groups)
    const { settings } = useSelector((state: RootState) => state.settings)
    const [editMaintenanceId, setEditMaintenanceId] = useState<
        number | undefined
    >()
    const [confirmDeleteVehicle, setConfirmDeleteVehicle] =
        useState<boolean>(false)
    const [editMaintenanceField, setEditMaintenanceField] = useState<string>()

    const locale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return enUS
        }
    }, [settings?.locale])

    const handleEditMaintenanceOpen = useCallback((id: number | undefined) => {
        setEditMaintenanceId(id)
    }, [])

    return (
        <Drawer
            open={Boolean(vehicle?.key)}
            anchor="right"
            onClose={() => router.push('/vehicles')}
        >
            {!vehicle && (
                <Box display="flex" justifyContent="center" p={2} sx={sx.wrap}>
                    <NextLink href={'/vehicles'}>
                        <IconButton size="small" sx={sx.edit}>
                            <Close />
                        </IconButton>
                    </NextLink>
                    <Typography>
                        <FormattedMessage id="app.VehicleNotFound" />
                    </Typography>
                </Box>
            )}
            {vehicle && (
                <Box sx={sx.wrap}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">
                            <FormattedMessage id="app.Details" />
                        </Typography>
                        <NextLink href={'/vehicles'}>
                            <IconButton size="small">
                                <Close />
                            </IconButton>
                        </NextLink>
                    </Box>
                    <Paper sx={sx.paper}>
                        {edit !== 'name' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Name" />
                                </Typography>
                                <Overflow
                                    text={vehicle?.name || '-'}
                                    variant="h6"
                                />
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/name`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'name' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveVehicleField('name')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Name" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    value={editedVehicle?.name || ''}
                                    onChange={(event) => {
                                        setEditedVehicle({
                                            ...vehicle,
                                            name: event.target.value || '',
                                        })
                                    }}
                                    fullWidth
                                    sx={sx.select}
                                    helperText={
                                        <FormattedMessage id="app.NameExamples" />
                                    }
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        vehicle.name === editedVehicle?.name ||
                                        !editedVehicle?.name
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
                                            router.push(
                                                `/vehicles/${vehicle?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Box sx={sx.flex}>
                            <Box sx={sx.left}>
                                <FormattedMessage id="app.Type" />
                                <Typography variant="h6">
                                    {vehicle?.type ? (
                                        <FormattedMessage
                                            id={`app.VehicleType.${vehicle?.type}`}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </Typography>
                            </Box>
                            <Box sx={sx.right}>
                                <FormattedMessage id="app.Fuel" />
                                <Typography variant="h6">
                                    {vehicle?.fuel ? (
                                        <FormattedMessage
                                            id={`app.FuelType.${vehicle?.fuel}`}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'trailer' && (
                            <>
                                <Typography>
                                    <FormattedMessage id="app.Trailer" />
                                </Typography>
                                <Overflow
                                    text={
                                        allTrailers?.find(
                                            (t) => t.key === vehicle?.trailerId
                                        )?.name || '-'
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
                                            router.push(
                                                `/vehicles/${vehicle?.key}/trailer`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {edit === 'trailer' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveVehicleField('trailerId')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Trailer" />
                                </Typography>
                                <Select
                                    items={[editedVehicle?.trailerId || '']}
                                    setItems={(trailer) =>
                                        setEditedVehicle({
                                            ...vehicle,
                                            trailerId:
                                                typeof trailer === 'string'
                                                    ? trailer
                                                    : trailer?.[0],
                                        })
                                    }
                                    type="trailers"
                                    sx={sx.select}
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        vehicle.trailerId ===
                                        editedVehicle?.trailerId
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
                                            router.push(
                                                `/vehicles/${vehicle?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'mileage' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/mileage`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography sx={sx.textWrap}>
                                    <FormattedMessage id="app.Mileage" />
                                </Typography>
                                <Box
                                    display="flex"
                                    alignItems="baseline"
                                    gap={1}
                                >
                                    <Overflow
                                        text={vehicle?.mileage || '-'}
                                        variant="h6"
                                    />
                                    <Typography>
                                        {editedVehicle?.units === 'km' ? (
                                            <FormattedMessage id="app.Km" />
                                        ) : editedVehicle?.units === 'm' ? (
                                            <FormattedMessage id="app.Mi" />
                                        ) : (
                                            <FormattedMessage id="app.Hrs" />
                                        )}
                                    </Typography>
                                </Box>
                            </>
                        )}
                        {edit === 'mileage' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveVehicleField('mileage')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Mileage" />
                                </Typography>
                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/vehicles/${vehicle?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.Mileage" />
                                    }
                                    value={editedVehicle?.mileage || ''}
                                    onChange={(event) =>
                                        setEditedVehicle({
                                            ...vehicle,
                                            mileage: +event.target.value,
                                        })
                                    }
                                    sx={sx.select}
                                    fullWidth
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            max: 999999999,
                                        },
                                        endAdornment: (
                                            <FormattedMessage
                                                id={
                                                    editedVehicle?.units ===
                                                    'km'
                                                        ? 'app.Km'
                                                        : editedVehicle?.units ===
                                                          'm'
                                                        ? 'app.Mi'
                                                        : 'app.Hrs'
                                                }
                                            />
                                        ),
                                    }}
                                />
                                <Button
                                    color="primary"
                                    disabled={
                                        (editedVehicle?.mileage &&
                                            +editedVehicle?.mileage) ===
                                        (vehicle?.mileage && +vehicle.mileage)
                                    }
                                    type="submit"
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'groups' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/groups`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Groups" />
                                </Typography>
                                {vehicle.groups
                                    ? vehicle.groups.map((g) => {
                                          const group = allGroups.find(
                                              (gr) => gr.key === g
                                          )
                                          return (
                                              group?.name && (
                                                  <Box key={group?.key}>
                                                      <Overflow
                                                          text={group.name}
                                                          variant="h6"
                                                      />
                                                      <Typography
                                                          variant="caption"
                                                          sx={sx.textWrap}
                                                      >
                                                          {group?.description ||
                                                              null}
                                                      </Typography>
                                                  </Box>
                                              )
                                          )
                                      })
                                    : '-'}
                                {(!vehicle.groups ||
                                    vehicle.groups.length === 0) && (
                                    <Typography>-</Typography>
                                )}
                            </>
                        )}
                        {edit === 'groups' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Groups" />
                                </Typography>
                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/vehicles/${vehicle?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <GroupsSelect
                                    groups={editedVehicle?.groups || []}
                                    setGroups={(groups) =>
                                        setEditedVehicle({
                                            ...vehicle,
                                            groups,
                                        })
                                    }
                                    type="vehicle"
                                    sx={sx.select}
                                    multiple
                                />
                                <Button
                                    color="primary"
                                    onClick={() => saveVehicleField('groups')}
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'drivers' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/drivers`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Drivers" />
                                </Typography>
                                {vehicle.drivers
                                    ? vehicle.drivers.map((d) => {
                                          const driver = allDrivers.find(
                                              (dr) => dr.key === d
                                          )
                                          return (
                                              driver?.name && (
                                                  <Box key={driver?.key}>
                                                      <Overflow
                                                          text={driver.name}
                                                          variant="h6"
                                                      />
                                                      <Typography
                                                          variant="caption"
                                                          sx={sx.textWrap}
                                                      >
                                                          {driver?.phone || '-'}
                                                      </Typography>
                                                  </Box>
                                              )
                                          )
                                      })
                                    : '-'}
                            </>
                        )}
                        {edit === 'drivers' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Drivers" />
                                </Typography>
                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/vehicles/${vehicle?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <Select
                                    items={editedVehicle?.drivers || []}
                                    setItems={(drivers) =>
                                        setEditedVehicle({
                                            ...vehicle,
                                            drivers,
                                        })
                                    }
                                    sx={sx.select}
                                    type="drivers"
                                    multiple
                                />
                                <Button
                                    color="primary"
                                    onClick={() => saveVehicleField('drivers')}
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Box>
                            <Typography>
                                <FormattedMessage id="app.Routes" />
                            </Typography>
                            <Tooltip
                                title={<FormattedMessage id="app.AddRoute" />}
                            >
                                <IconButton
                                    size="small"
                                    sx={sx.edit}
                                    onClick={() => {
                                        router.push(
                                            `/vehicles/${vehicle?.key}/route`
                                        )
                                        reset()
                                    }}
                                >
                                    <AddCircle />
                                </IconButton>
                            </Tooltip>
                            {edit === 'route' && editedVehicle && (
                                <Route
                                    vehicleId={vehicle?.key}
                                    units={editedVehicle.units}
                                    routeId={routeId}
                                    drivers={editedVehicle?.drivers}
                                />
                            )}
                        </Box>
                        <List dense sx={sx.fixedHeight}>
                            {routes?.[0]?.key === 'loading' ? (
                                <Box sx={sx.loading}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                routes.map((route) => (
                                    <ListItem key={route.key} disablePadding>
                                        <ListItemButton
                                            onClick={() =>
                                                router.push(
                                                    `/vehicles/${vehicle?.key}/route/${route.key}`
                                                )
                                            }
                                        >
                                            <ListItemIcon>
                                                <RouteIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Overflow
                                                        text={
                                                            (route?.locations &&
                                                                route.locations
                                                                    .map(
                                                                        (
                                                                            location
                                                                        ) =>
                                                                            location.code
                                                                    )
                                                                    .join(
                                                                        ' → '
                                                                    )) ||
                                                            ''
                                                        }
                                                    />
                                                }
                                                secondary={`${
                                                    route.startDate &&
                                                    format(
                                                        new Date(
                                                            +route.startDate
                                                        ),
                                                        'dd/MM/yyyy HH:mm'
                                                    )
                                                } - ${
                                                    route.endDate &&
                                                    format(
                                                        new Date(
                                                            +route.endDate
                                                        ),
                                                        'dd/MM/yyyy HH:mm'
                                                    )
                                                }`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            )}
                        </List>
                        {(!routes || routes.length === 0) && (
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Typography>
                                    <FormattedMessage id="app.NoRoutes" />
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                    <Documents type="vehicle" typeId={vehicle.key} />
                    <Paper sx={sx.paper}>
                        {edit !== 'notes' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/notes`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Notes" />
                                </Typography>
                                {vehicle.notes && (
                                    <Box sx={sx.fixedHeight}>
                                        <Typography
                                            sx={{
                                                whiteSpace: 'pre-line',
                                                wordBreak: 'break-all',
                                                fontSize: 14,
                                            }}
                                            mt={2}
                                        >
                                            {vehicle.notes}
                                        </Typography>
                                    </Box>
                                )}
                                {!vehicle.notes && (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        mb={2}
                                    >
                                        <Typography>
                                            <FormattedMessage id="app.NoNotes" />
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                        {edit === 'notes' && (
                            <Box
                                component="form"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveVehicleField('notes')
                                }}
                            >
                                <Typography mb={2}>
                                    <FormattedMessage id="app.Notes" />
                                </Typography>
                                <Tooltip
                                    title={<FormattedMessage id="app.Cancel" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            reset()
                                            router.push(
                                                `/vehicles/${vehicle?.key}`
                                            )
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                                <TextareaAutoSize
                                    value={editedVehicle?.notes || ''}
                                    onChange={(event) =>
                                        setEditedVehicle({
                                            ...vehicle,
                                            notes: event.target.value,
                                        })
                                    }
                                    maxRows={16}
                                />
                                <Button color="primary" type="submit">
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Typography>
                            <FormattedMessage id="app.Maintenance" />
                        </Typography>
                        <Box sx={sx.edit}>
                            <AddMaintenance
                                vehicleId={vehicle.key}
                                drivers={vehicle?.drivers || []}
                                units={vehicle.units || 'km'}
                            />
                        </Box>
                        {maintenances &&
                            maintenances.length > 0 &&
                            (maintenances?.[0]?.key === 'loading' ? (
                                <Box sx={sx.loading}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Box sx={sx.fixedHeight}>
                                    <MuiTable size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    &nbsp;
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    <FormattedMessage id="app.Date" />
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    <FormattedMessage id="app.Type" />
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    <FormattedMessage id="app.Cost" />
                                                </TableCell>
                                                <TableCell
                                                    sx={sx.smallCellHead}
                                                >
                                                    &nbsp;
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {maintenances.map((m, i) => (
                                                <TableRow key={i}>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                    >
                                                        <MaintenanceStatus
                                                            maintenance={m}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                    >
                                                        {m.date &&
                                                            format(
                                                                new Date(
                                                                    +m.date
                                                                ),
                                                                'dd/MM/yyyy'
                                                            )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        style={{
                                                            maxWidth: '160px',
                                                        }}
                                                    >
                                                        <Overflow
                                                            text={m.type || ''}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        style={{
                                                            maxWidth: '90px',
                                                        }}
                                                    >
                                                        <Overflow
                                                            text={m.cost || ''}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        align="right"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleEditMaintenanceOpen(
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </MuiTable>
                                </Box>
                            ))}
                        <EditMaintenance
                            maintenance={
                                typeof editMaintenanceId === 'number'
                                    ? maintenances?.[editMaintenanceId]
                                    : undefined
                            }
                            edit={editMaintenanceField}
                            onClose={() => setEditMaintenanceId(undefined)}
                            onCancel={() => setEditMaintenanceField(undefined)}
                            onEdit={(field) => setEditMaintenanceField(field)}
                        />
                        {(!maintenances || maintenances.length === 0) && (
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Typography>
                                    <FormattedMessage id="app.NoMaintenances" />
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                    <Divider />
                    <LoadingButton
                        sx={sx.warn}
                        onClick={() => setConfirmDeleteVehicle(true)}
                        startIcon={<Delete />}
                        color="secondary"
                        fullWidth
                    >
                        <FormattedMessage id="app.DeleteVehicle" />
                    </LoadingButton>
                    <Confirm
                        onCancel={() => setConfirmDeleteVehicle(false)}
                        onSubmit={() => {
                            deleteVehicle()
                            setConfirmDeleteVehicle(false)
                        }}
                        isOpen={confirmDeleteVehicle}
                        message={
                            <FormattedMessage
                                id="app.Deleting"
                                values={{
                                    name: (
                                        <Overflow text={vehicle.name || ''} />
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

export default EditVehicle
