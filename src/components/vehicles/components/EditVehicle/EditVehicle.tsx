import {
    useState,
    useEffect,
    useCallback,
    ChangeEvent,
    SyntheticEvent,
} from 'react'
import {
    Box,
    Typography,
    Button,
    Drawer,
    Paper,
    IconButton,
    List,
    ListItem,
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
    Link,
    TextField,
    ListItemSecondaryAction,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Tooltip,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import {
    Close,
    Edit,
    ArrowDownward,
    Adjust,
    InsertDriveFile,
    AddCircle,
    Visibility,
    CloudUpload,
    Delete,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { FormattedMessage, useIntl } from 'react-intl'
// import EditServiceDialog from './EditServiceDialog'
// import NewServiceDialog from './NewServiceDialog'
import LoadingButton from '../../../common/LoadingButton/LoadingButton'
import { db, auth, storage } from '../../../../services/firebase'
import { ref, update } from 'firebase/database'
import {
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'
import { uuid } from 'uuidv4'
import sx from './styles/EditVehicle.sx'
// import routes from '../../api/routes';
import { serviceTypes } from '../../../../api/services'
import types from '../../../../api/types'
import drivers from '../../../../api/drivers'
import { EditVehicleProps, Files, UploadProgress } from './types'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'

const EditVehicle = ({ vehicleId, vehicle, edit }: EditVehicleProps) => {
    const intl = useIntl()
    const router = useRouter()
    const { settings } = useSelector((state: RootState) => state.settings)
    // const [fuelRoute, setFuelRoute] = useState(routes[0]);
    const [services, setServices] = useState(vehicle?.services || [])
    const [editServiceOpen, setEditServiceOpen] = useState(false)
    const [serviceId, setServiceId] = useState<string | boolean>(false)
    const [newServiceOpen, setNewServiceOpen] = useState(false)
    const [name, setName] = useState(vehicle?.name || '')
    const [type, setType] = useState(vehicle?.type || 0)
    const [driver, setDriver] = useState(
        drivers.find((d) => d.id === vehicle?.driver)
    )
    const [filesToUpload, setFilesToUpload] = useState<Files>([])
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>([])
    const [uploadedFiles, setUploadedFiles] = useState(vehicle?.files || [])
    const [uploadError, setUploadError] = useState<string | boolean>(false)
    const [units, setUnits] = useState<string>(
        vehicle?.units || settings?.units
    )
    const [mileage, setMileage] = useState(vehicle?.mileage || 0)
    const currentDriver = drivers.find((d) => d.id === vehicle?.driver)
    const key = vehicle?.key
    console.log(vehicle?.units, settings?.units, units)
    useEffect(() => {
        setName(vehicle?.name || '')
        setServices(vehicle?.services || [])
        setType(vehicle?.type || 0)
        setDriver(drivers.find((d) => d.id === vehicle?.driver))
        setUploadedFiles(vehicle?.files || [])
        setMileage(vehicle?.mileage || 0)
        setUnits(vehicle?.units || settings?.units)
    }, [vehicle, settings?.units])

    // const handleFRChange = (e) => {
    //   setFuelRoute(routes.find(r => r.date === e.target.value));
    // };

    const handleEditServiceOpen = useCallback((id: string | boolean) => {
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

    const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }, [])

    const saveName = useCallback(
        (event: SyntheticEvent) => {
            event.preventDefault()
            if (!key || !auth?.currentUser?.uid || name === '') return
            update(ref(db, 'vehicles/' + auth?.currentUser?.uid + '/' + key), {
                name,
            })
            router.push('/vehicles/' + vehicleId)
        },
        [router, vehicleId, key, name]
    )

    const handleType = useCallback((event: SelectChangeEvent) => {
        setType(+event.target.value)
    }, [])

    const saveType = useCallback(
        (event: SyntheticEvent) => {
            event.preventDefault()
            if (!key || !type || !auth?.currentUser?.uid) return
            if (!type) return
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + key), {
                type,
            })
            router.push('/vehicles/' + vehicleId)
        },
        [key, router, vehicleId, type, vehicle]
    )

    const handleUnits = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (!key || !auth?.currentUser?.uid) return
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + key), {
                units: event.target.value,
            })
            setUnits(event.target.value)
        },
        [key, auth?.currentUser?.uid, db]
    )

    const handleMileage = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setMileage(+event.target.value)
        },
        []
    )

    const saveMileage = useCallback(
        (event: SyntheticEvent) => {
            event.preventDefault()
            if (!key || !driver || !auth?.currentUser?.uid) return
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + key), {
                mileage,
            })
            router.push('/vehicles/' + vehicleId)
        },
        [router, key, vehicleId, mileage, vehicle, driver]
    )

    const handleDriver = useCallback((event: SelectChangeEvent) => {
        setDriver(drivers.find((d) => d.id === event.target.value))
    }, [])

    const saveDriver = useCallback(
        (event: SyntheticEvent) => {
            event.preventDefault()
            if (!key || !driver || !auth?.currentUser?.uid) return
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + key), {
                driver: driver.id,
            })
            router.push('/vehicles/' + vehicleId)
        },
        [router, key, vehicleId, driver, vehicle]
    )

    const handleFilesUpload = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (
                !event ||
                !event.target ||
                !event.target.files ||
                event.target.files.length === 0
            ) {
                return
            }
            setFilesToUpload(
                Array.from(event.target.files).map((file) => {
                    return { filename: file, progress: 0 }
                })
            )
        },
        []
    )

    useEffect(() => {
        filesToUpload.map((up, i) => {
            if (!auth?.currentUser?.uid) return
            const fileNameSplit = up.filename.name.split('.')
            const ext = fileNameSplit.pop()
            const fileName = uuid() + '-' + Date.now() + '.' + ext
            const filePath = `user/${auth.currentUser.uid}/vehicles/${fileName}`
            // const uploadTask = storage.child(filePath).put(up.filename);
            const currentRef = storageRef(storage, filePath)
            const uploadTask = uploadBytesResumable(currentRef, up.filename)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setUploadProgress(
                        filesToUpload.map((p, index) =>
                            i === index
                                ? {
                                      filename: up.filename,
                                      path: filePath,
                                      progress,
                                  }
                                : p
                        )
                    )
                },
                (error) => {
                    setUploadError(
                        intl.formatMessage({
                            id: error.code || 'storage/unknown',
                        })
                    )
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setUploadedFiles((oldUploadedFiles) => {
                                const files = [
                                    ...oldUploadedFiles,
                                    {
                                        name: filesToUpload[i].filename.name,
                                        url: downloadURL,
                                        path: filePath,
                                    },
                                ]
                                return files
                            })
                        }
                    )
                }
            )
            return null
        })
    }, [filesToUpload, key, intl])

    useEffect(() => {
        if (!key) return
        setUploadProgress((oldUploadProgress) =>
            oldUploadProgress.filter(
                (oup) => !uploadedFiles.find((uf) => uf.path === oup.path)
            )
        )
        const currentFilesCount = vehicle?.files?.length || 0
        if (
            uploadedFiles.length === filesToUpload.length + currentFilesCount &&
            auth.currentUser
        ) {
            setUploadProgress([])
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + key), {
                files: uploadedFiles,
            })
        }
    }, [uploadedFiles, key, filesToUpload, vehicle])

    const deleteUploadedFile = useCallback(
        (f) => {
            if (!key || !auth?.currentUser?.uid) return
            const desertRef = ref(storage, f.path)
            deleteObject(desertRef)
                .then(() => {
                    const files = uploadedFiles.filter(
                        (uf) => uf.path !== f.path
                    )
                    vehicle.files = files
                    update(
                        ref(
                            db,
                            'vehicles/' + auth?.currentUser?.uid + '/' + key
                        ),
                        { files }
                    )
                    setUploadedFiles(files)
                })
                .catch((error) =>
                    setUploadError(
                        intl.formatMessage({ id: 'storage/unknown' }) +
                            ': ' +
                            error
                    )
                )
        },
        [intl, key, vehicle, uploadedFiles]
    )

    const saveService = useCallback(
        (s) => {
            if (!key || !auth?.currentUser?.uid) return
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + key), {
                services: s,
            })
        },
        [key]
    )

    const deleteVehicle = useCallback(() => {
        console.log('delete vehicle', key)
        // TODO: delete the vehicle and write a function for clearing the db and storage
    }, [key])

    return (
        <Drawer
            open={Boolean(vehicleId)}
            anchor="right"
            onClose={() => router.push('/vehicles')}
        >
            {!vehicle && (
                <Box display="flex" justifyContent="center" p={2} sx={sx.wrap}>
                    <Typography>
                        <FormattedMessage id="app.VehicleNotFound" />
                    </Typography>
                </Box>
            )}
            {vehicle && (
                <Box sx={sx.wrap}>
                    <Box display="flex" justifyContent="space-between">
                        <FormattedMessage id="app.Details" />
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
                                <Typography variant="h6">{name}</Typography>
                                <NextLink href={`/vehicles/${vehicleId}/name`}>
                                    <IconButton size="small" sx={sx.edit}>
                                        <Edit />
                                    </IconButton>
                                </NextLink>
                            </>
                        )}
                        {edit === 'name' && (
                            <form onSubmit={saveName}>
                                <Typography>
                                    <FormattedMessage id="app.Name" />
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={<FormattedMessage id="app.Name" />}
                                    value={name || ''}
                                    onChange={handleName}
                                    fullWidth
                                    sx={sx.select}
                                />
                                <Button
                                    color="primary"
                                    disabled={!name}
                                    type="submit"
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>

                                <NextLink href={`/vehicles/${vehicleId}`}>
                                    <Tooltip
                                        title={
                                            <FormattedMessage id="app.Cancel" />
                                        }
                                    >
                                        <IconButton size="small" sx={sx.edit}>
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                </NextLink>
                            </form>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'type' && (
                            <>
                                <NextLink href={`/vehicles/${vehicleId}/type`}>
                                    <IconButton size="small" sx={sx.edit}>
                                        <Edit />
                                    </IconButton>
                                </NextLink>
                                <Typography>
                                    <FormattedMessage id="app.Type" />
                                </Typography>
                                <Typography variant="h6">
                                    {
                                        types.find(
                                            (t) => t.id === vehicle?.type
                                        )?.name
                                    }
                                </Typography>
                            </>
                        )}
                        {edit === 'type' && (
                            <form onSubmit={saveType}>
                                <Typography>
                                    <FormattedMessage id="app.Type" />
                                </Typography>
                                <NextLink href={`/vehicles/${vehicleId}`}>
                                    <Tooltip
                                        title={
                                            <FormattedMessage id="app.Cancel" />
                                        }
                                    >
                                        <IconButton size="small" sx={sx.edit}>
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                </NextLink>
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
                                        value={type}
                                        onChange={handleType}
                                        label={
                                            <FormattedMessage id="app.Type" />
                                        }
                                    >
                                        {types.map((t, i) => (
                                            <MenuItem key={i} value={t.id}>
                                                {t.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    color="primary"
                                    disabled={!type}
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
                                <NextLink href={`/vehicles/${vehicleId}/units`}>
                                    <IconButton size="small" sx={sx.edit}>
                                        <Edit />
                                    </IconButton>
                                </NextLink>
                                <Typography>
                                    <FormattedMessage id="app.Units" />
                                </Typography>
                                <Typography variant="h6">
                                    {units === 'm' ? (
                                        <FormattedMessage id="app.Miles" />
                                    ) : (
                                        <FormattedMessage id="app.Km" />
                                    )}
                                </Typography>
                            </>
                        )}
                        {edit === 'units' && (
                            <Box>
                                <NextLink href={`/vehicles/${vehicleId}`}>
                                    <Tooltip
                                        title={
                                            <FormattedMessage id="app.Cancel" />
                                        }
                                    >
                                        <IconButton size="small" sx={sx.edit}>
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                </NextLink>
                                <Box>
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
                                            value={units || 'km'}
                                            onChange={handleUnits}
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
                                </Box>
                            </Box>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        {edit !== 'mileage' && (
                            <>
                                <NextLink
                                    href={`/vehicles/${vehicleId}/mileage`}
                                >
                                    <IconButton size="small" sx={sx.edit}>
                                        <Edit />
                                    </IconButton>
                                </NextLink>
                                <Typography>
                                    <FormattedMessage id="app.Mileage" />
                                </Typography>
                                <Typography variant="h6">{mileage}</Typography>
                                <Typography>
                                    {units === 'km' ? (
                                        <FormattedMessage id="app.Km" />
                                    ) : (
                                        <FormattedMessage id="app.Miles" />
                                    )}
                                </Typography>
                            </>
                        )}
                        {edit === 'mileage' && (
                            <form onSubmit={saveMileage}>
                                <Typography>
                                    <FormattedMessage id="app.Mileage" />
                                </Typography>
                                <NextLink href={`/vehicles/${vehicleId}`}>
                                    <Tooltip
                                        title={
                                            <FormattedMessage id="app.Cancel" />
                                        }
                                    >
                                        <IconButton size="small" sx={sx.edit}>
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                </NextLink>
                                <TextField
                                    variant="outlined"
                                    label={
                                        <FormattedMessage id="app.Mileage" />
                                    }
                                    value={mileage || ''}
                                    onChange={handleMileage}
                                    sx={sx.select}
                                    fullWidth
                                    helperText={
                                        units === 'km' ? (
                                            <FormattedMessage id="app.Km" />
                                        ) : (
                                            <FormattedMessage id="app.Miles" />
                                        )
                                    }
                                />
                                <Button
                                    color="primary"
                                    disabled={!mileage}
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
                                <NextLink
                                    href={`/vehicles/${vehicleId}/driver`}
                                >
                                    <IconButton size="small" sx={sx.edit}>
                                        <Edit />
                                    </IconButton>
                                </NextLink>
                                <Typography>
                                    <FormattedMessage id="app.Driver" />
                                </Typography>
                                <Typography variant="h6">
                                    {currentDriver?.name}
                                </Typography>
                                <Typography variant="caption">
                                    {currentDriver?.phone}
                                </Typography>
                            </>
                        )}
                        {edit === 'driver' && (
                            <form onSubmit={saveDriver}>
                                <Typography>
                                    <FormattedMessage id="app.Driver" />
                                </Typography>
                                <NextLink href={`/vehicles/${vehicleId}`}>
                                    <Tooltip
                                        title={
                                            <FormattedMessage id="app.Cancel" />
                                        }
                                    >
                                        <IconButton size="small" sx={sx.edit}>
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                </NextLink>
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
                                        value={driver?.id}
                                        onChange={handleDriver}
                                        label={
                                            <FormattedMessage id="app.Driver" />
                                        }
                                    >
                                        {drivers.map((d, i) => (
                                            <MenuItem key={i} value={d.id}>
                                                {d.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    color="primary"
                                    disabled={!driver}
                                    type="submit"
                                >
                                    <FormattedMessage id="app.Save" />
                                </Button>
                            </form>
                        )}
                    </Paper>
                    <Paper sx={sx.paper}>
                        <IconButton size="small" sx={sx.edit}>
                            <Edit />
                        </IconButton>
                        <Typography>
                            <FormattedMessage id="app.LastRoute" />
                        </Typography>
                        <List dense>
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
                        <List dense sx={sx.routesList}>
                            <ListItem button selected>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                            <ListItem button>
                                <ListItemText
                                    primary="Sevlievo, BG > Sofia, BG > Sevlievo, BG"
                                    secondary="11/11/2020 - 12/11/2020"
                                />
                            </ListItem>
                        </List>
                    </Paper>
                    <Paper sx={sx.paper}>
                        <form>
                            <Box sx={sx.edit}>
                                <input
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
                                </Tooltip>
                            </Box>
                            <Typography>
                                <FormattedMessage id="app.Documents" />
                            </Typography>
                            {uploadError && <Box>{uploadError}</Box>}
                            <List dense>
                                {uploadedFiles.map((uf, i) => (
                                    <ListItem key={i}>
                                        <ListItemIcon>
                                            <InsertDriveFile />
                                        </ListItemIcon>
                                        <ListItemText primary={uf.name} />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    deleteUploadedFile(uf)
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                {uploadProgress.map((up, i) => (
                                    <ListItem key={i}>
                                        <ListItemIcon>
                                            <InsertDriveFile />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={up.filename.name}
                                            secondary={`${Math.round(
                                                up.progress
                                            )}%`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            {uploadProgress.length === 0 &&
                                uploadedFiles.length === 0 && (
                                    <Box display="flex" justifyContent="center">
                                        <Typography>
                                            <FormattedMessage id="app.NoDocuments" />
                                        </Typography>
                                    </Box>
                                )}
                        </form>
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
                            <Box display="flex" justifyContent="center">
                                <Typography>
                                    <FormattedMessage id="app.NoService" />
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                    <Divider />
                    <LoadingButton
                        sx={sx.warn}
                        onClick={deleteVehicle}
                        startIcon={<Delete />}
                        color="secondary"
                    >
                        <FormattedMessage id="app.DeleteVehicle" />
                    </LoadingButton>
                </Box>
            )}
        </Drawer>
    )
}

export default EditVehicle
