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
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Divider,
    TextField,
    ListItemSecondaryAction,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Tooltip,
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
} from '@mui/icons-material'
import { format, formatRelative } from 'date-fns'
import { bg, enUS } from 'date-fns/locale'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { FormattedMessage, useIntl } from 'react-intl'
// import EditServiceDialog from './EditServiceDialog'
// import NewServiceDialog from './NewServiceDialog'
import LoadingButton from '../../../common/LoadingButton/LoadingButton'
import { db, auth } from '../../../../services/firebase'
import { ref, update } from 'firebase/database'
import sx from './styles/EditVehicle.sx'
// import routes from '../../api/routes';
import { serviceTypes } from '../../../../api/services'
import drivers from '../../../../api/drivers'
import { EditVehicleProps } from './types'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'
import { Service, VehicleFile, VehicleTypes, FuelTypes } from '../../types'
import useEditVehicle from './hooks/useEditVehicle'
import Upload from '../../../common/Upload/Upload'
import Confirm from '../../../common/Confirm/Confirm'

const EditVehicle = ({ vehicle, edit }: EditVehicleProps) => {
    const intl = useIntl()
    const router = useRouter()
    const {
        saveVehicleField,
        editedVehicle,
        setEditedVehicle,
        reset,
        downloadFile,
        deleteUploadedFile,
        deleteVehicle,
    } = useEditVehicle(vehicle)
    const { settings } = useSelector((state: RootState) => state.settings)
    // const [fuelRoute, setFuelRoute] = useState(routes[0]);
    const [services, setServices] = useState(vehicle?.services || [])
    const [editServiceOpen, setEditServiceOpen] = useState(false)
    const [serviceId, setServiceId] = useState<number | boolean>(false)
    const [newServiceOpen, setNewServiceOpen] = useState(false)
    const [confirmDeleteFile, setConfirmDeleteFile] = useState<
        VehicleFile | undefined
    >()
    const [confirmDeleteVehicle, setConfirmDeleteVehicle] =
        useState<boolean>(false)
    const currentDriver = drivers.find((d) => d.id === vehicle?.driver)

    const locale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return enUS
        }
    }, [settings?.locale])

    const handleEditServiceOpen = useCallback((id: number | boolean) => {
        setServiceId(id)
        setEditServiceOpen(true)
    }, [])

    const handleEditServiceClose = useCallback(() => {
        setEditServiceOpen(false)
    }, [])

    const handleNewServiceOpen = useCallback(() => {
        setNewServiceOpen(true)
    }, [])

    const handleNewServiceClose = useCallback(() => {
        setNewServiceOpen(false)
    }, [])

    const saveService = useCallback(
        (s: Service) => {
            if (!vehicle?.key || !auth?.currentUser?.uid) return
            update(
                ref(
                    db,
                    'vehicles/' + auth.currentUser.uid + '/' + vehicle?.key
                ),
                {
                    services: s,
                }
            )
        },
        [vehicle?.key]
    )

    const vehiclesTypeKeys = Object.keys(VehicleTypes) as Array<
        keyof typeof VehicleTypes
    >
    const fuelKeys = Object.keys(FuelTypes) as Array<keyof typeof FuelTypes>

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
                                {vehicle?.name && vehicle.name.length > 40 ? (
                                    <Tooltip title={vehicle.name}>
                                        <Typography
                                            variant="h6"
                                            sx={sx.textWrap}
                                        >
                                            {vehicle.name}
                                        </Typography>
                                    </Tooltip>
                                ) : (
                                    <Typography variant="h6" sx={sx.textWrap}>
                                        {vehicle.name}
                                    </Typography>
                                )}
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
                            <form
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
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        vehicle.name === editedVehicle?.name
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
                            </form>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'type' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/type`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Type" />
                                </Typography>
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
                            </>
                        )}
                        {edit === 'type' && (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveVehicleField('type')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Type" />
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
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    sx={sx.select}
                                >
                                    <InputLabel id="type-label">
                                        <FormattedMessage id="app.Type" />
                                    </InputLabel>
                                    <Select
                                        labelId="type-label"
                                        id="type"
                                        value={editedVehicle?.type || ''}
                                        onChange={(event) =>
                                            setEditedVehicle({
                                                ...vehicle,
                                                type: event.target
                                                    .value as keyof VehicleTypes,
                                            })
                                        }
                                        label={
                                            <FormattedMessage id="app.Type" />
                                        }
                                    >
                                        {!editedVehicle?.type && (
                                            <MenuItem value={''} disabled>
                                                &#8212;
                                            </MenuItem>
                                        )}
                                        {vehiclesTypeKeys.map((key, i) => (
                                            <MenuItem key={i} value={key}>
                                                {
                                                    <FormattedMessage
                                                        id={`app.VehicleType.${VehicleTypes[key]}`}
                                                    />
                                                }
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    color="primary"
                                    disabled={
                                        !editedVehicle?.type ||
                                        editedVehicle.type === vehicle.type
                                    }
                                    type="submit"
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </form>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'fuel' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/fuel`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Fuel" />
                                </Typography>
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
                            </>
                        )}
                        {edit === 'fuel' && (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveVehicleField('fuel')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Fuel" />
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
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    sx={sx.select}
                                >
                                    <InputLabel id="type-label">
                                        <FormattedMessage id="app.Fuel" />
                                    </InputLabel>
                                    <Select
                                        labelId="type-label"
                                        id="type"
                                        value={editedVehicle?.fuel || ''}
                                        onChange={(event) =>
                                            setEditedVehicle({
                                                ...vehicle,
                                                fuel: event.target
                                                    .value as keyof FuelTypes,
                                            })
                                        }
                                        label={
                                            <FormattedMessage id="app.Fuel" />
                                        }
                                    >
                                        {!editedVehicle?.fuel && (
                                            <MenuItem value={''} disabled>
                                                &#8212;
                                            </MenuItem>
                                        )}
                                        {fuelKeys.map((key, i) => (
                                            <MenuItem key={i} value={key}>
                                                {
                                                    <FormattedMessage
                                                        id={`app.FuelType.${FuelTypes[key]}`}
                                                    />
                                                }
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    color="primary"
                                    disabled={
                                        !editedVehicle?.fuel ||
                                        editedVehicle.fuel === vehicle.fuel
                                    }
                                    type="submit"
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </form>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'units' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/units`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Units" />
                                </Typography>
                                <Typography variant="h6">
                                    {(vehicle.units || settings.units) ===
                                    'm' ? (
                                        <FormattedMessage id="app.Miles" />
                                    ) : (
                                        <FormattedMessage id="app.Km" />
                                    )}
                                </Typography>
                            </>
                        )}
                        {edit === 'units' && (
                            <Box>
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
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault()
                                        saveVehicleField('units')
                                    }}
                                >
                                    <FormControl component="fieldset">
                                        <FormLabel
                                            component="legend"
                                            sx={sx.paddingTop}
                                        >
                                            <FormattedMessage id="app.Units" />
                                        </FormLabel>
                                        <RadioGroup
                                            aria-label="units"
                                            row
                                            name="units"
                                            value={
                                                editedVehicle?.units ||
                                                settings.units ||
                                                'km'
                                            }
                                            onChange={(event) =>
                                                setEditedVehicle({
                                                    ...vehicle,
                                                    units: event.target.value,
                                                })
                                            }
                                        >
                                            <FormControlLabel
                                                value="km"
                                                control={<Radio />}
                                                label={
                                                    <FormattedMessage id="app.Km" />
                                                }
                                            />
                                            <FormControlLabel
                                                value="m"
                                                control={<Radio />}
                                                label={
                                                    <FormattedMessage id="app.Miles" />
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    <Box>
                                        <Button
                                            color="primary"
                                            type="submit"
                                            disabled={
                                                editedVehicle?.units ===
                                                vehicle.units
                                            }
                                        >
                                            <FormattedMessage id="app.Save" />
                                        </Button>
                                    </Box>
                                </form>
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
                                {vehicle?.mileage &&
                                vehicle?.mileage.toString().length > 40 ? (
                                    <Tooltip title={vehicle?.mileage}>
                                        <Typography
                                            variant="h6"
                                            sx={sx.textWrap}
                                        >
                                            {vehicle?.mileage}
                                        </Typography>
                                    </Tooltip>
                                ) : (
                                    <Typography variant="h6" sx={sx.textWrap}>
                                        {vehicle?.mileage}
                                    </Typography>
                                )}
                                <Typography>
                                    {vehicle.units === 'km' ? (
                                        <FormattedMessage id="app.Km" />
                                    ) : (
                                        <FormattedMessage id="app.Miles" />
                                    )}
                                </Typography>
                            </>
                        )}
                        {edit === 'mileage' && (
                            <form
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
                                    }}
                                    helperText={
                                        vehicle.units === 'km' ? (
                                            <FormattedMessage id="app.Km" />
                                        ) : (
                                            <FormattedMessage id="app.Miles" />
                                        )
                                    }
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
                            </form>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'driver' && (
                            <>
                                <Tooltip
                                    title={<FormattedMessage id="app.Edit" />}
                                >
                                    <IconButton
                                        size="small"
                                        sx={sx.edit}
                                        onClick={() => {
                                            router.push(
                                                `/vehicles/${vehicle?.key}/driver`
                                            )
                                            reset()
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Typography>
                                    <FormattedMessage id="app.Driver" />
                                </Typography>
                                {currentDriver?.name &&
                                currentDriver?.name.length > 40 ? (
                                    <Tooltip title={currentDriver?.name}>
                                        <Typography
                                            variant="h6"
                                            sx={sx.textWrap}
                                        >
                                            {currentDriver.name}
                                        </Typography>
                                    </Tooltip>
                                ) : (
                                    <Typography variant="h6" sx={sx.textWrap}>
                                        {currentDriver?.name}
                                    </Typography>
                                )}
                                <Typography variant="caption" sx={sx.textWrap}>
                                    {currentDriver?.phone}
                                </Typography>
                            </>
                        )}
                        {edit === 'driver' && (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveVehicleField('driver')
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="app.Driver" />
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
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    sx={sx.select}
                                >
                                    <InputLabel id="driver-label">
                                        <FormattedMessage id="app.Driver" />
                                    </InputLabel>
                                    <Select
                                        labelId="driver-label"
                                        id="driver"
                                        value={editedVehicle?.driver || ''}
                                        onChange={(event) => {
                                            setEditedVehicle({
                                                ...vehicle,
                                                driver:
                                                    event.target.value || '',
                                            })
                                        }}
                                        label={
                                            <FormattedMessage id="app.Driver" />
                                        }
                                    >
                                        {drivers.map((d) => (
                                            <MenuItem key={d.id} value={d.id}>
                                                {d.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    color="primary"
                                    disabled={
                                        editedVehicle?.driver === vehicle.driver
                                    }
                                    type="submit"
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </form>
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
                                <IconButton size="small" sx={sx.edit}>
                                    <AddCircle />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <List dense sx={sx.fixedHeight}>
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
                            {/* <input
                                type="file"
                                id="document-upload"
                                name="document-upload"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFilesUpload}
                            />
                            <Tooltip
                                title={<FormattedMessage id="app.Upload" />}
                            >
                                <IconButton size="small">
                                    <label
                                        htmlFor="document-upload"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <CloudUpload />
                                    </label>
                                </IconButton>
                            </Tooltip> */}
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
                                    <ListItem key={i}>
                                        <ListItemIcon
                                            onClick={() => downloadFile(uf)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <InsertDriveFile />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                uf.name &&
                                                uf.name.length > 30 ? (
                                                    <Tooltip title={uf.name}>
                                                        <Typography
                                                            sx={sx.textWrap}
                                                        >
                                                            {uf.name.replaceAll(
                                                                ' ',
                                                                String.fromCharCode(
                                                                    160
                                                                )
                                                            )}
                                                        </Typography>
                                                    </Tooltip>
                                                ) : (
                                                    <Typography
                                                        sx={sx.textWrap}
                                                    >
                                                        {uf.name}
                                                    </Typography>
                                                )
                                            }
                                            secondary={formatRelative(
                                                new Date(uf.date),
                                                new Date(),
                                                { locale }
                                            )}
                                            onClick={() => downloadFile(uf)}
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    setConfirmDeleteFile(uf)
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        </ListItemSecondaryAction>
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
                                        file:
                                            confirmDeleteFile &&
                                            confirmDeleteFile?.name.length >
                                                20 ? (
                                                <Tooltip
                                                    title={
                                                        confirmDeleteFile?.name
                                                    }
                                                >
                                                    <Typography
                                                        sx={sx.textWrapSmall}
                                                    >
                                                        {confirmDeleteFile?.name.replaceAll(
                                                            ' ',
                                                            String.fromCharCode(
                                                                160
                                                            )
                                                        )}
                                                    </Typography>
                                                </Tooltip>
                                            ) : (
                                                <Typography sx={sx.textWrap}>
                                                    {confirmDeleteFile?.name}
                                                </Typography>
                                            ),
                                    }}
                                />
                            }
                            type="warn"
                            submit={<FormattedMessage id="app.Delete" />}
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
                            <Tooltip
                                title={<FormattedMessage id="app.AddService" />}
                                sx={sx.button}
                            >
                                <IconButton
                                    size="small"
                                    onClick={handleNewServiceOpen}
                                >
                                    <AddCircle />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {/* <NewServiceDialog
                            newServiceOpen={newServiceOpen}
                            handleNewServiceClose={handleNewServiceClose}
                            setServices={setServices}
                            saveService={saveService}
                        /> */}
                        {services?.length > 0 && (
                            <MuiTable size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={sx.smallCellHead}>
                                            <FormattedMessage id="app.Date" />
                                        </TableCell>
                                        <TableCell sx={sx.smallCellHead}>
                                            <FormattedMessage id="app.Type" />
                                        </TableCell>
                                        <TableCell sx={sx.smallCellHead}>
                                            <FormattedMessage id="app.Cost" />
                                        </TableCell>
                                        <TableCell sx={sx.smallCellHead}>
                                            &nbsp;
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {services.map((s, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={sx.smallCell}>
                                                {format(
                                                    new Date(+s.date),
                                                    'dd/MM/yyyy'
                                                )}
                                            </TableCell>
                                            <TableCell sx={sx.smallCell}>
                                                {serviceTypes[s.type]}
                                            </TableCell>
                                            <TableCell sx={sx.smallCell}>
                                                {s.cost}
                                            </TableCell>
                                            <TableCell
                                                sx={sx.smallCell}
                                                align="right"
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleEditServiceOpen(i)
                                                    }
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </MuiTable>
                        )}
                        {/* <EditServiceDialog
                            editServiceOpen={editServiceOpen}
                            handleEditServiceClose={handleEditServiceClose}
                            setServices={setServices}
                            saveService={saveService}
                            service={services[serviceId]}
                            serviceId={serviceId}
                        /> */}
                        {services.length === 0 && (
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
                                values={{ name: vehicle.name }}
                            />
                        }
                        type="warn"
                        submit={<FormattedMessage id="app.Delete" />}
                    />
                </Box>
            )}
        </Drawer>
    )
}

export default EditVehicle
