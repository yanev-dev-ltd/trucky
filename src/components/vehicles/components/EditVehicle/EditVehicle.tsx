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
    ListSubheader,
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
    ArrowDownward,
    Adjust,
    InsertDriveFile,
    AddCircle,
    Visibility,
    Delete,
    NotificationsActive,
} from '@mui/icons-material'
import { format, formatRelative } from 'date-fns'
import { bg, enUS } from 'date-fns/locale'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { FormattedMessage } from 'react-intl'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { auth } from '@/services/firebase'
import sx from './styles/EditVehicle.sx'
import allDrivers from '@/api/drivers'
import { EditVehicleProps } from './types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { VehicleFile, VehicleTypes, FuelTypes, Service } from '../../types'
import useEditVehicle from './hooks/useEditVehicle'
import Upload from '@/components/common/Upload/Upload'
import Confirm from '@/components/common/Confirm/Confirm'
import Overflow from '@/components/common/Overflow/Overflow'
import NewService from './components/NewService/NewService'
import EditService from './components/EditService/EditService'
import Route from '@/components/routes/components/Route/Route'
import { DriversSelect } from '@/components/drivers/components/DriversSelect/DriversSelect'

const EditVehicle = ({ vehicle, edit, routeId }: EditVehicleProps) => {
    const router = useRouter()
    const {
        saveVehicleField,
        editedVehicle,
        setEditedVehicle,
        reset,
        downloadFile,
        deleteUploadedFile,
        deleteVehicle,
        addService,
        service,
    } = useEditVehicle(vehicle)
    const { settings } = useSelector((state: RootState) => state.settings)
    const [editService, setEditService] = useState<Service | undefined>()
    const [confirmDeleteFile, setConfirmDeleteFile] = useState<
        VehicleFile | undefined
    >()
    const [confirmDeleteVehicle, setConfirmDeleteVehicle] =
        useState<boolean>(false)

    const locale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return enUS
        }
    }, [settings?.locale])

    const handleEditServiceOpen = useCallback((s: Service | undefined) => {
        setEditService(s)
    }, [])

    const handleEditServiceClose = useCallback(() => {
        setEditService(undefined)
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
                                            id={`app.VehicleType.${
                                                VehicleTypes[
                                                    vehicle?.type as keyof typeof VehicleTypes
                                                ]
                                            }`}
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
                                            id={`app.FuelType.${
                                                FuelTypes[
                                                    vehicle?.fuel as keyof typeof FuelTypes
                                                ]
                                            }`}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </Typography>
                            </Box>
                        </Box>
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
                                              <Box key={driver?.key}>
                                                  <Overflow
                                                      text={driver?.name || '-'}
                                                      variant="h6"
                                                  />
                                                  <Typography
                                                      variant="caption"
                                                      sx={sx.textWrap}
                                                  >
                                                      {driver?.phone}
                                                  </Typography>
                                              </Box>
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
                                    saveVehicleField('drivers')
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
                                <DriversSelect
                                    drivers={editedVehicle?.drivers || []}
                                    setDrivers={(drivers) =>
                                        setEditedVehicle({
                                            ...vehicle,
                                            drivers,
                                        })
                                    }
                                    sx={sx.select}
                                />
                                <Button color="primary" type="submit">
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Tooltip title={<FormattedMessage id="app.Edit" />}>
                            <IconButton size="small" sx={sx.edit}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Typography>
                            <FormattedMessage id="app.LastRoute" />
                        </Typography>
                        <List sx={sx.select} dense>
                            <ListItem>
                                <ListItemIcon>
                                    <Adjust />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Sevlievo, BG"
                                    secondary="11/11/2020"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ArrowDownward />
                                </ListItemIcon>
                                <ListItemText primary="Sofia, BG" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Adjust />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Sevlievo, BG"
                                    secondary="12/11/2020"
                                />
                            </ListItem>
                        </List>
                        <List dense sx={sx.flexList}>
                            <ListSubheader sx={sx.listLabel}>
                                <FormattedMessage id="app.Distance" />:
                            </ListSubheader>
                            <ListItem sx={sx.listText}>
                                <ListItemText primary="1200" />
                            </ListItem>
                            <ListSubheader sx={sx.listLabel}>
                                <FormattedMessage id="app.Fuel" />:
                            </ListSubheader>
                            <ListItem sx={sx.listText}>
                                <ListItemText primary="240" />
                            </ListItem>
                        </List>
                        <Box sx={sx.relative}>
                            <Typography>
                                <FormattedMessage id="app.AllRoutes" />
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
                            {edit === 'route' && (
                                <Route
                                    vehicleId={vehicle?.key}
                                    units={editedVehicle?.units}
                                    routeId={routeId}
                                    drivers={editedVehicle?.drivers}
                                />
                            )}
                        </Box>
                        <List dense sx={sx.fixedHeight}>
                            <ListItemButton
                                onClick={() =>
                                    router.push(
                                        `/vehicles/${vehicle?.key}/route/test`
                                    )
                                }
                            >
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItemButton>
                        </List>
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Box sx={sx.edit}>
                            <Upload
                                filepath={
                                    auth?.currentUser?.uid
                                        ? `user/${auth?.currentUser?.uid}/vehicles`
                                        : undefined
                                }
                                dbpath={
                                    auth?.currentUser?.uid
                                        ? `vehicles/${auth.currentUser.uid}/${vehicle?.key}`
                                        : undefined
                                }
                                currentFiles={vehicle?.files || []}
                            />
                        </Box>
                        <Typography>
                            <FormattedMessage id="app.Documents" />
                        </Typography>
                        <List dense sx={sx.fixedHeight}>
                            {vehicle?.files &&
                                vehicle?.files.length > 0 &&
                                vehicle?.files.map((uf, i) => (
                                    <ListItem
                                        key={i}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    setConfirmDeleteFile(uf)
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton
                                            onClick={() => downloadFile(uf)}
                                        >
                                            <ListItemIcon>
                                                <InsertDriveFile />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Overflow text={uf.name} />
                                                }
                                                secondary={formatRelative(
                                                    new Date(uf.date),
                                                    new Date(),
                                                    { locale }
                                                )}
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                        <Confirm
                            onCancel={() => setConfirmDeleteFile(undefined)}
                            onSubmit={() => {
                                confirmDeleteFile &&
                                    deleteUploadedFile(confirmDeleteFile)
                                setConfirmDeleteFile(undefined)
                            }}
                            isOpen={Boolean(confirmDeleteFile)}
                            message={
                                <FormattedMessage
                                    id="app.DeleteFileConfirm"
                                    values={{
                                        file: (
                                            <Overflow
                                                text={
                                                    confirmDeleteFile?.name ||
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
                        {(!vehicle?.files || vehicle?.files.length === 0) && (
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Typography>
                                    <FormattedMessage id="app.NoDocuments" />
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <Typography>
                            <FormattedMessage id="app.Service" />
                        </Typography>
                        <Box sx={sx.edit}>
                            <NewService
                                addService={addService}
                                drivers={vehicle?.drivers || []}
                                units={vehicle.units}
                            />
                        </Box>
                        {service &&
                            service.length > 0 &&
                            (service?.[0]?.key === 'loading' ? (
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
                                            {service.map((s, i) => (
                                                <TableRow key={i}>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                    >
                                                        {(s.reminderDate ||
                                                            s.reminderMileage) && (
                                                            <Tooltip
                                                                title={
                                                                    s.reminderDate &&
                                                                    s.reminderMileage ? (
                                                                        <FormattedMessage id="app.Service.AlarmDateAndMileage" />
                                                                    ) : s.reminderDate ? (
                                                                        <FormattedMessage id="app.Service.AlarmDate" />
                                                                    ) : (
                                                                        <FormattedMessage id="app.Service.AlarmMileage" />
                                                                    )
                                                                }
                                                            >
                                                                <NotificationsActive />
                                                            </Tooltip>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                    >
                                                        {s.date &&
                                                            format(
                                                                new Date(
                                                                    +s.date
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
                                                            text={s.type || ''}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        style={{
                                                            maxWidth: '90px',
                                                        }}
                                                    >
                                                        <Overflow
                                                            text={s.cost || ''}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={sx.smallCell}
                                                        align="right"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleEditServiceOpen(
                                                                    s
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
                        <EditService
                            handleEditServiceClose={handleEditServiceClose}
                            service={editService}
                            units={vehicle.units}
                        />
                        {(!service || service.length === 0) && (
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Typography>
                                    <FormattedMessage id="app.NoService" />
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
