import { useState } from 'react'
import {
    Dialog,
    Box,
    DialogContent,
    Typography,
    TextField,
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
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { RouteProps } from './types'
import sx from './styles/Route.sx'
import useRoute from './hooks/useRoute'
import StopDialog from '../StopDialog/StopDialog'
import { Location } from './types'
import Overflow from '@/components/common/Overflow/Overflow'
import { SortableList } from '../../../common/SortableList/SortableList'
import Map from '@/components/common/Map/Map'
import { OrderDialog } from '@/components/orders/components/OrderDialog/OrderDialog'
import { Order } from '@/components/orders/types'
import { DriversSelect } from '@/components/drivers/components/DriversSelect/DriversSelect'
import Confirm from '@/components/common/Confirm/Confirm'

const Route = ({ vehicleId, units, routeId, drivers }: RouteProps) => {
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
        clearRoute,
    } = useRoute(routeId, drivers)
    const intl = useIntl()
    const [routeOpen, setRouteOpen] = useState<boolean>(false)
    const [orderOpen, setOrderOpen] = useState<boolean>(false)
    const [deleteLocation, setDeleteLocation] = useState<number | null>(null)
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
                        <Box sx={sx.row}>
                            <DriversSelect
                                drivers={route.drivers || []}
                                setDrivers={(drivers) =>
                                    changeField('drivers', drivers)
                                }
                            />
                        </Box>
                        <Box sx={sx.row}>
                            <DesktopDateTimePicker
                                label={
                                    <FormattedMessage id="app.StartDateAndHour" />
                                }
                                inputFormat="dd/MM/yyyy HH:mm"
                                ampm={false}
                                value={route?.startDate || null}
                                onChange={(d: Date | null) =>
                                    d && changeField('startDate', d.getTime())
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        inputProps={{
                                            ...params.inputProps,
                                            placeholder: intl.formatMessage({
                                                id: 'app.dd/MM/yyyy HH:mm',
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={sx.row}>
                            <DesktopDateTimePicker
                                label={
                                    <FormattedMessage id="app.EndDateAndHour" />
                                }
                                inputFormat="dd/MM/yyyy HH:mm"
                                value={route?.endDate || null}
                                onChange={(d: Date | null) =>
                                    d && changeField('endDate', d.getTime())
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        inputProps={{
                                            ...params.inputProps,
                                            placeholder:
                                                intl.formatMessage({
                                                    id: 'app.dd/MM/yyyy HH:mm',
                                                }) || '',
                                        }}
                                    />
                                )}
                            />
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
                                                            (loc: Location) =>
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
                                                                        setDeleteLocation(
                                                                            index
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
                                                                    index &&
                                                                route.locations &&
                                                                route.locations
                                                                    .length >
                                                                    1 ? (
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
                                                                primary={
                                                                    <Overflow
                                                                        text={
                                                                            `(${
                                                                                index !==
                                                                                    undefined &&
                                                                                index +
                                                                                    1
                                                                            }) ` +
                                                                                `[${location.code}] ` +
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
                                                                                {(
                                                                                    (distance[
                                                                                        index
                                                                                    ] /
                                                                                        1000) *
                                                                                    (units ===
                                                                                    'm'
                                                                                        ? 0.621371192
                                                                                        : 1)
                                                                                ).toFixed(
                                                                                    1
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
                                                            {(location.loading ||
                                                                location.unloading ||
                                                                location.parking ||
                                                                location.refueling) && (
                                                                <Box
                                                                    sx={
                                                                        sx.icons
                                                                    }
                                                                >
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
                                                            )}
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
                                <Confirm
                                    onCancel={() => setDeleteLocation(null)}
                                    onSubmit={() => {
                                        changeField(
                                            'locations',
                                            route.locations?.filter(
                                                (l: Location, ind: number) =>
                                                    ind !== deleteLocation
                                            )
                                        )
                                        setDeleteLocation(null)
                                    }}
                                    isOpen={deleteLocation !== null}
                                    message={
                                        <FormattedMessage
                                            id="app.Deleting"
                                            values={{
                                                name: (
                                                    <Overflow
                                                        text={
                                                            `[${
                                                                route.locations[
                                                                    deleteLocation ||
                                                                        0
                                                                ]?.code
                                                            }] ${
                                                                route.locations[
                                                                    deleteLocation ||
                                                                        0
                                                                ]?.address
                                                            }` || ''
                                                        }
                                                    />
                                                ),
                                            }}
                                        />
                                    }
                                    type="warn"
                                    submit={
                                        <FormattedMessage id="app.Delete" />
                                    }
                                    cancel={
                                        <FormattedMessage id="app.Cancel" />
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
                                        <Box component="span">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setOrderOpen(true)
                                                }
                                                disabled={
                                                    !route.locations ||
                                                    route.locations.length < 2
                                                }
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </Box>
                                    </Tooltip>
                                </Box>
                                {(!route.orders ||
                                    route.orders.length === 0) && (
                                    <Box sx={sx.noOrders}>
                                        {!route.locations ||
                                        route.locations.length < 2 ? (
                                            <FormattedMessage id="app.OrderNeedsStops" />
                                        ) : (
                                            <FormattedMessage id="app.NoOrders" />
                                        )}
                                    </Box>
                                )}
                                {route.orders && route.orders.length > 0 && (
                                    <List>
                                        {route.orders.map(
                                            (order: Order, index: number) => {
                                                return (
                                                    <ListItem
                                                        key={index}
                                                    ></ListItem>
                                                )
                                            }
                                        )}
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
                        onClick={() => {
                            clearRoute()
                            router.push(`/vehicles/${vehicleId}`)
                        }}
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
                            noRoute ||
                            !route.endDate ||
                            !route.startDate
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
