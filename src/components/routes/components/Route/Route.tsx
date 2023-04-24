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
    List,
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
    DirectionsBoat,
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { RouteProps } from './types'
import sx from './sx/Route.sx'
import useRoute from './hooks/useRoute'
import allDrivers from '@/api/drivers'
import StopDialog from '../StopDialog/StopDialog'
import { Location } from './types'
import Overflow from '@/components/common/Overflow/Overflow'
import { SortableList } from '../../../common/SortableList/SortableList'
import Map from '@/components/common/Map/Map'
import { OrderDialog } from '@/components/orders/components/OrderDialog/OrderDialog'
import { Order } from '@/components/orders/types'

const Route = ({ vehicleId, units, routeId }: RouteProps) => {
    const {
        route,
        changeField,
        distance,
        setDistance,
        toll,
        setToll,
        ferry,
        setFerry,
        noRoute,
        setNoRoute,
    } = useRoute(routeId)
    const [routeOpen, setRouteOpen] = useState<boolean>(false)
    const [orderOpen, setOrderOpen] = useState<boolean>(false)
    const [hoveredLocation, setHoveredLocation] = useState<number | undefined>()
    const router = useRouter()

    return (
        <Dialog open fullScreen>
            <Box component="form">
                <DialogContent sx={sx.dialog}>
                    <Box sx={sx.info}>
                        <Typography variant="h6">
                            <FormattedMessage
                                id={routeId ? 'app.EditRoute' : 'app.AddRoute'}
                            />
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
                        <Box sx={sx.row}>
                            <Paper sx={sx.locations}>
                                <Box sx={sx.locationsHeader}>
                                    <Typography>
                                        <FormattedMessage id="app.Stops" />
                                    </Typography>
                                    <Tooltip
                                        title={
                                            <FormattedMessage id="app.AddStop" />
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
                                        <FormattedMessage id="app.NoStops" />
                                    </Box>
                                )}
                                {route.locations &&
                                    route.locations.length > 0 && (
                                        <SortableList
                                            items={route.locations}
                                            onChange={(locations: Location[]) =>
                                                changeField(
                                                    'locations',
                                                    locations
                                                )
                                            }
                                            renderItem={(
                                                location: Location
                                            ) => {
                                                const index =
                                                    (route.locations &&
                                                        route.locations.findIndex(
                                                            (loc) =>
                                                                loc.id ===
                                                                location.id
                                                        )) ||
                                                    0
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
                                                            <ListItemIcon
                                                                sx={sx.icon}
                                                            >
                                                                {hoveredLocation ===
                                                                index ? (
                                                                    <SortableList.DragHandle />
                                                                ) : index ===
                                                                      0 ||
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
                                                                    maxWidth:
                                                                        '180px',
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
                                                                secondary={
                                                                    <>
                                                                        {Boolean(
                                                                            distance[
                                                                                index
                                                                            ]
                                                                        ) && (
                                                                            <Typography variant="caption">
                                                                                {Math.round(
                                                                                    (distance[
                                                                                        index
                                                                                    ] /
                                                                                        1000) *
                                                                                        (units ===
                                                                                        'm'
                                                                                            ? 0.621371192
                                                                                            : 1)
                                                                                )}
                                                                                <FormattedMessage
                                                                                    id={
                                                                                        units ===
                                                                                        'm'
                                                                                            ? 'app.Mi'
                                                                                            : 'app.Km'
                                                                                    }
                                                                                />
                                                                            </Typography>
                                                                        )}{' '}
                                                                        {Boolean(
                                                                            toll[
                                                                                index
                                                                            ]
                                                                        ) && (
                                                                            <Typography variant="caption">
                                                                                <FormattedMessage id="app.Toll" />

                                                                                :{' '}
                                                                                {
                                                                                    +toll[
                                                                                        index
                                                                                    ].toFixed(
                                                                                        2
                                                                                    )
                                                                                }

                                                                                €
                                                                            </Typography>
                                                                        )}
                                                                        {ferry[
                                                                            index
                                                                        ] && (
                                                                            <Tooltip
                                                                                title={
                                                                                    <FormattedMessage id="app.FerryIncluded" />
                                                                                }
                                                                            >
                                                                                <DirectionsBoat
                                                                                    fontSize="small"
                                                                                    sx={{
                                                                                        marginLeft: 1,
                                                                                        marginBottom:
                                                                                            -0.7,
                                                                                    }}
                                                                                />
                                                                            </Tooltip>
                                                                        )}
                                                                    </>
                                                                }
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
                                <StopDialog
                                    open={routeOpen}
                                    setOpen={setRouteOpen}
                                    addLocation={(
                                        location: Location | undefined
                                    ) =>
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
                        <Box sx={sx.row}>
                            <Paper sx={sx.orders}>
                                <Box sx={sx.ordersHeader}>
                                    <Typography>
                                        <FormattedMessage id="app.Orders" />
                                    </Typography>
                                    <Tooltip
                                        title={
                                            <FormattedMessage id="app.AddOrder" />
                                        }
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => setOrderOpen(true)}
                                        >
                                            <AddCircle />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                {(!route.orders ||
                                    route.orders.length === 0) && (
                                    <Box sx={sx.noOrders}>
                                        <FormattedMessage id="app.NoOrders" />
                                    </Box>
                                )}
                                {route.orders && route.orders.length > 0 && (
                                    <List>
                                        {route.orders.map((order, index) => {
                                            return (
                                                <ListItem
                                                    key={index}
                                                ></ListItem>
                                            )
                                        })}
                                    </List>
                                )}
                                <OrderDialog
                                    open={orderOpen}
                                    setOpen={setOrderOpen}
                                    addOrder={(order: Order | undefined) =>
                                        order &&
                                        changeField(
                                            'orders',
                                            route.orders
                                                ? [...route.orders, order]
                                                : [order]
                                        )
                                    }
                                />
                            </Paper>
                        </Box>
                    </Box>
                    <Map
                        locations={route.locations || []}
                        sx={{
                            height: 'calc(100vh - 53px)',
                            width: '100%',
                            flexGrow: 1,
                        }}
                        setDistance={setDistance}
                        setToll={setToll}
                        setFerry={setFerry}
                        setNoRoute={setNoRoute}
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
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={
                            !route?.locations ||
                            route.locations.length < 2 ||
                            !route.drivers ||
                            route.drivers.length === 0 ||
                            noRoute
                        }
                    >
                        <FormattedMessage
                            id={routeId ? 'app.EditRoute' : 'app.AddRoute'}
                        />
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default Route
