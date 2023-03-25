import { useState } from 'react'
import {
    Dialog,
    Box,
    DialogContent,
    Typography,
    FormControl,
    TextField,
    Autocomplete,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
    Paper,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import {
    Add,
    AddCircle,
    Adjust,
    ArrowDownward,
    FileUpload,
    LocalParking,
    LocalGasStation,
    Download,
    Delete,
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { AddRouteProps } from './types'
import sx from './sx/AddRoute.sx'
import useAddRoute from './hooks/useAddRoute'
import allDrivers from '@/api/drivers'
import LocationDialog from '../LocationDialog/LocationDialog'
import { Location } from './types'
import Overflow from '@/components/common/Overflow/Overflow'
import { SortableList } from './components/SortableList/SortableList'
import Map from '@/components/common/Map/Map'

const AddRoute = ({ vehicleId }: AddRouteProps) => {
    const { route, changeField } = useAddRoute()
    const [routeOpen, setRouteOpen] = useState<boolean>(false)
    const [hoveredLocation, setHoveredLocation] = useState<number | undefined>()
    const router = useRouter()

    return (
        <Dialog open fullScreen>
            <Box component="form">
                <DialogContent sx={sx.dialog}>
                    <Box sx={sx.info}>
                        <Typography variant="h6">
                            <FormattedMessage id="app.AddRoute" />
                        </Typography>
                        <Box
                            sx={sx.row}
                            display="flex"
                            gap={1}
                            alignItems="flex-start"
                        >
                            <FormControl fullWidth variant="outlined">
                                <Autocomplete
                                    id="drivers"
                                    multiple
                                    options={allDrivers}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(_, values) =>
                                        changeField('drivers', values)
                                    }
                                    groupBy={(option) => option.name.charAt(0)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <FormattedMessage id="app.Drivers" />
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                            <Tooltip
                                title={<FormattedMessage id="app.AddDriver" />}
                            >
                                <IconButton sx={{ marginTop: 1 }}>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={sx.row}>
                            <TextField
                                label={
                                    <FormattedMessage id="app.FuelConsumption" />
                                }
                                variant="outlined"
                                value={route.fuelConsumption || ''}
                                onChange={(event) =>
                                    changeField(
                                        'fuelConsumption',
                                        event.target.value
                                    )
                                }
                                fullWidth
                                type="number"
                            />
                        </Box>
                        <Paper sx={sx.locations}>
                            <Box sx={sx.locationsHeader}>
                                <Typography>
                                    <FormattedMessage id="app.Locations" />
                                </Typography>
                                <Tooltip
                                    title={
                                        <FormattedMessage id="app.AddLocation" />
                                    }
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => setRouteOpen(true)}
                                    >
                                        <AddCircle />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {(!route.locations ||
                                route.locations.length === 0) && (
                                <Box sx={sx.noLocations}>
                                    <FormattedMessage id="app.NoLocations" />
                                </Box>
                            )}
                            {route.locations && route.locations.length > 0 && (
                                <SortableList
                                    items={route.locations}
                                    onChange={(locations: Location[]) =>
                                        changeField('locations', locations)
                                    }
                                    renderItem={(location: Location) => {
                                        const index =
                                            route.locations &&
                                            route.locations.findIndex(
                                                (loc) => loc.id === location.id
                                            )
                                        return (
                                            <SortableList.Item
                                                id={location.id || ''}
                                            >
                                                <ListItem
                                                    secondaryAction={
                                                        <IconButton
                                                            onClick={() =>
                                                                changeField(
                                                                    'locations',
                                                                    route.locations?.filter(
                                                                        (
                                                                            l,
                                                                            ind
                                                                        ) =>
                                                                            ind !==
                                                                            index
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    }
                                                    disableGutters
                                                    onMouseOver={() =>
                                                        setHoveredLocation(
                                                            index
                                                        )
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredLocation(
                                                            undefined
                                                        )
                                                    }
                                                    sx={sx.listItem}
                                                >
                                                    <ListItemIcon sx={sx.icon}>
                                                        {hoveredLocation ===
                                                        index ? (
                                                            <SortableList.DragHandle />
                                                        ) : index === 0 ||
                                                          index ===
                                                              (route?.locations &&
                                                                  route
                                                                      ?.locations
                                                                      .length -
                                                                      1) ? (
                                                            <Adjust />
                                                        ) : (
                                                            <ArrowDownward />
                                                        )}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        sx={{
                                                            maxWidth: '180px',
                                                        }}
                                                        primary={
                                                            <Overflow
                                                                text={
                                                                    `(${
                                                                        index !==
                                                                            undefined &&
                                                                        index +
                                                                            1
                                                                    }) ` +
                                                                        location.address ||
                                                                    ''
                                                                }
                                                            />
                                                        }
                                                        secondary="test"
                                                    />
                                                    <Box sx={sx.icons}>
                                                        {location.loading && (
                                                            <Tooltip
                                                                title={
                                                                    <FormattedMessage id="app.Loading" />
                                                                }
                                                            >
                                                                <FileUpload fontSize="small" />
                                                            </Tooltip>
                                                        )}
                                                        {location.unloading && (
                                                            <Tooltip
                                                                title={
                                                                    <FormattedMessage id="app.Unloading" />
                                                                }
                                                            >
                                                                <Download fontSize="small" />
                                                            </Tooltip>
                                                        )}
                                                        {location.parking && (
                                                            <Tooltip
                                                                title={
                                                                    <FormattedMessage id="app.Parking" />
                                                                }
                                                            >
                                                                <LocalParking fontSize="small" />
                                                            </Tooltip>
                                                        )}
                                                        {location.refueling && (
                                                            <Tooltip
                                                                title={
                                                                    <FormattedMessage id="app.Refueling" />
                                                                }
                                                            >
                                                                <LocalGasStation fontSize="small" />
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </ListItem>
                                            </SortableList.Item>
                                        )
                                    }}
                                />
                            )}
                            <LocationDialog
                                open={routeOpen}
                                setOpen={setRouteOpen}
                                addLocation={(location: Location | undefined) =>
                                    location &&
                                    changeField(
                                        'locations',
                                        route.locations
                                            ? [...route.locations, location]
                                            : [location]
                                    )
                                }
                            />
                        </Paper>
                    </Box>
                    <Map
                        locations={route.locations || []}
                        sx={{
                            height: 'calc(100vh - 53px)',
                            width: '100%',
                            flexGrow: 1,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button sx={sx.left} variant="outlined">
                        <FormattedMessage id="app.Print" />
                    </Button>
                    <Button
                        onClick={() => router.push(`/vehicles/${vehicleId}`)}
                    >
                        <FormattedMessage id="app.Cancel" />
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                        <FormattedMessage id="app.AddRoute" />
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default AddRoute
