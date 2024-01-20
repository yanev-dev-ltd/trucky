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
    ListItemButton,
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
    ListAlt,
    Print,
} from '@mui/icons-material'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { RouteProps } from '../../types'
import sx from './styles/Route.sx'
import useRoute from './hooks/useRoute'
import StopDialog from '../StopDialog/StopDialog'
import { Location } from '../../types'
import Overflow from '@/components/common/Overflow/Overflow'
import { SortableList } from '../../../common/SortableList/SortableList'
import Map from '@/components/common/Map/Map'
import { OrderDialog } from '@/components/orders/components/OrderDialog/OrderDialog'
import { Order } from '@/components/orders/types'
import Confirm from '@/components/common/Confirm/Confirm'
import LoadingButton from '@/components/common/LoadingButton/LoadingButton'
import { GroupsSelect } from '@/components/common/Group/components/GroupsSelect/GroupsSelect'
import { Select } from '@/components/common/Select/Select'

const Route = ({ vehicleId, units, routeId, drivers, onClose }: RouteProps) => {
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
        saveRoute,
        deleteRoute,
        setDeleteRouteOpen,
        deleteRouteOpen,
    } = useRoute(routeId, drivers, vehicleId)
    const intl = useIntl()
    const [routeOpen, setRouteOpen] = useState<boolean>(false)
    const [orderOpen, setOrderOpen] = useState<number | boolean>(false)
    const [deleteLocation, setDeleteLocation] = useState<number | null>(null)
    const [deleteOrder, setDeleteOrder] = useState<number | null>(null)
    const [hoveredLocation, setHoveredLocation] = useState<number | undefined>()
    const router = useRouter()

    return (
        <Dialog open fullScreen>
            <Box
                component="form"
                onSubmit={(event) => {
                    event.preventDefault()
                    if (
                        !route?.locations ||
                        route.locations.length < 2 ||
                        !route.drivers ||
                        route.drivers.length === 0 ||
                        noRoute ||
                        !route.endDate ||
                        !route.startDate ||
                        (!vehicleId && !route.vehicleId)
                    )
                        return
                    saveRoute()
                    onClose && onClose()
                }}
            >
                <DialogContent sx={sx.dialog}>
                    <Box sx={sx.info}>
                        <Typography variant="h6">
                            <FormattedMessage
                                id={routeId ? 'app.EditRoute' : 'app.AddRoute'}
                            />
                        </Typography>
                        {!vehicleId && (
                            <Box sx={sx.row}>
                                <Select
                                    items={
                                        route?.vehicleId
                                            ? [route?.vehicleId]
                                            : []
                                    }
                                    setItems={(vehicles) =>
                                        changeField(
                                            'vehicleId',
                                            typeof vehicles[0] === 'string'
                                                ? vehicles[0]
                                                : undefined
                                        )
                                    }
                                    type="vehicles"
                                />
                            </Box>
                        )}
                        <Box sx={sx.row}>
                            <Select
                                items={route?.drivers || []}
                                setItems={(drivers) =>
                                    changeField('drivers', drivers)
                                }
                                type="drivers"
                                multiple
                            />
                        </Box>
                        <Box sx={sx.row}>
                            <GroupsSelect
                                groups={route?.groups || []}
                                setGroups={(groups) =>
                                    changeField('groups', groups)
                                }
                                type="route"
                                sx={sx.select}
                                multiple
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
                                value={route?.fuelConsumption || ''}
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
                                            onChange={(
                                                locations: Location[]
                                            ) => {
                                                changeField(
                                                    'locations',
                                                    locations
                                                )
                                            }}
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
                                                                    disabled={
                                                                        route.orders &&
                                                                        route.orders.some(
                                                                            (
                                                                                order: Order
                                                                            ) =>
                                                                                order
                                                                                    ?.startStop
                                                                                    ?.code ===
                                                                                    location.code ||
                                                                                order
                                                                                    ?.endStop
                                                                                    ?.code ===
                                                                                    location.code
                                                                        )
                                                                    }
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            }
                                                            disableGutters
                                                            onMouseOver={() =>
                                                                !route.orders ||
                                                                route.orders
                                                                    .length ===
                                                                    0 ||
                                                                (route.orders.every(
                                                                    (
                                                                        order: Order
                                                                    ) =>
                                                                        order.shouldDelete
                                                                ) &&
                                                                    setHoveredLocation(
                                                                        index
                                                                    ))
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
                                        changeField('locations', [
                                            ...(route.locations || []),
                                            location,
                                        ])
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
                                                                route.locations &&
                                                                route.locations[
                                                                    deleteLocation ||
                                                                        0
                                                                ]?.code
                                                            }] ${
                                                                route.locations &&
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
                                    route.orders.length === 0 ||
                                    route.orders.every(
                                        (order: Order) =>
                                            order.shouldDelete === true
                                    )) && (
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
                                                if (order.shouldDelete)
                                                    return null
                                                return (
                                                    <ListItem
                                                        key={index}
                                                        secondaryAction={
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="delete"
                                                                onClick={() =>
                                                                    setDeleteOrder(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton
                                                            onClick={() => {
                                                                setOrderOpen(
                                                                    index
                                                                )
                                                            }}
                                                            disableGutters
                                                        >
                                                            <ListItemIcon
                                                                sx={sx.icon}
                                                            >
                                                                <ListAlt />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Overflow
                                                                        text={
                                                                            order.reference ||
                                                                            ''
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            }
                                        )}
                                    </List>
                                )}
                                {(typeof orderOpen === 'number' ||
                                    orderOpen === true) && (
                                    <OrderDialog
                                        open={orderOpen}
                                        setOpen={setOrderOpen}
                                        addOrder={(order: Order | undefined) =>
                                            order &&
                                            changeField('orders', [
                                                ...(route?.orders || []),
                                                order,
                                            ])
                                        }
                                        editOrder={(order: Order | undefined) =>
                                            order &&
                                            typeof orderOpen === 'number' &&
                                            changeField(
                                                'orders',
                                                route.orders.map(
                                                    (o: Order, i: number) =>
                                                        i === orderOpen
                                                            ? order
                                                            : o
                                                )
                                            )
                                        }
                                        deleteOrder={() => {
                                            changeField(
                                                'orders',
                                                route.orders?.map(
                                                    (
                                                        l: Location,
                                                        ind: number
                                                    ) =>
                                                        typeof orderOpen ===
                                                            'number' &&
                                                        ind === orderOpen
                                                            ? {
                                                                  key: l.key,
                                                                  shouldDelete:
                                                                      true,
                                                              }
                                                            : l
                                                )
                                            )
                                        }}
                                        locations={route.locations}
                                        date={route.startDate}
                                        order={
                                            typeof orderOpen === 'number' &&
                                            orderOpen >= 0 &&
                                            route.orders[orderOpen]
                                        }
                                        routeId={route.key}
                                        vehicleId={vehicleId}
                                    />
                                )}
                                <Confirm
                                    onCancel={() => setDeleteOrder(null)}
                                    onSubmit={() => {
                                        changeField(
                                            'orders',
                                            route.orders?.map(
                                                (l: Location, ind: number) =>
                                                    ind === deleteOrder
                                                        ? {
                                                              key: l.key,
                                                              shouldDelete:
                                                                  true,
                                                          }
                                                        : l
                                            )
                                        )
                                        setDeleteOrder(null)
                                    }}
                                    isOpen={deleteOrder !== null}
                                    message={
                                        <FormattedMessage
                                            id="app.Deleting"
                                            values={{
                                                name: (
                                                    <Overflow
                                                        text={
                                                            route.orders &&
                                                            route.orders[
                                                                deleteOrder || 0
                                                            ]?.reference
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
                    <Box sx={sx.actions}>
                        {routeId && (
                            <LoadingButton
                                sx={sx.warn}
                                startIcon={<Delete />}
                                color="secondary"
                                fullWidth
                                onClick={() => setDeleteRouteOpen(true)}
                            >
                                <FormattedMessage id="app.DeleteRoute" />
                            </LoadingButton>
                        )}
                        <Confirm
                            onCancel={() => setDeleteRouteOpen(false)}
                            onSubmit={deleteRoute}
                            isOpen={deleteRouteOpen}
                            message={
                                <FormattedMessage
                                    id="app.Deleting"
                                    values={{
                                        name: (
                                            <Overflow
                                                text={
                                                    route?.locations
                                                        ? route?.locations
                                                              .map(
                                                                  (
                                                                      location: Location
                                                                  ) =>
                                                                      location.code
                                                              )
                                                              .join(' → ')
                                                        : ''
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
                        <LoadingButton variant="outlined" startIcon={<Print />}>
                            <FormattedMessage id="app.Print" />
                        </LoadingButton>
                    </Box>
                    <Box display="flex" gap={1}>
                        <Button
                            onClick={() => {
                                clearRoute()
                                onClose && onClose()
                                router.push(
                                    vehicleId
                                        ? `/vehicles/${vehicleId}`
                                        : '/routes'
                                )
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
                                !route.startDate ||
                                (!vehicleId && !route.vehicleId)
                            }
                        >
                            <FormattedMessage
                                id={routeId ? 'app.EditRoute' : 'app.AddRoute'}
                            />
                        </Button>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default Route
