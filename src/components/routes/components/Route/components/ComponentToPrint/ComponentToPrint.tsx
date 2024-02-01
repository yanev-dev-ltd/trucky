import { Route } from '@/components/routes/types'
import {
    Box,
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material'
import { forwardRef } from 'react'
import { FormattedMessage } from 'react-intl'
import sx from './styles/ComponentToPrint.sx'
import { format } from 'date-fns'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import {
    Adjust,
    ArrowDownward,
    DirectionsBoat,
    Download,
    FileUpload,
    LocalGasStation,
    LocalParking,
} from '@mui/icons-material'
import { Order } from '@/components/orders/types'
import currencies from '@/api/currencies.json'
import { Currencies } from '@/components/settings/components/Currency/Currency'

const OrderPrint = ({ order }: { order: Order }) => {
    const allGroups = useSelector((state: RootState) => state.groups)
    const allClients = useSelector((state: RootState) => state.clients)
    return (
        <Grid
            container
            sx={{
                borderTop: '1px solid #999',
                padding: '12px 0',
                margin: '12px 0',
            }}
        >
            <Grid item xs={12}>
                <Typography variant="h6">{order.reference}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.StartStop" />
                </Typography>
                <Box>{order.startStop?.address || '-'}</Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.EndStop" />
                </Typography>
                <Box>{order.endStop?.address || '-'}</Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.DateExecution" />
                </Typography>
                <Box>
                    {order.dateExecution
                        ? format(order.dateExecution, 'dd/MM/yyyy')
                        : '-'}
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.DateCompletion" />
                </Typography>
                <Box>
                    {order.dateCompletion
                        ? format(order.dateCompletion, 'dd/MM/yyyy')
                        : '-'}
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.Groups" />
                </Typography>
                <Box>
                    {allGroups
                        .filter((g) => order.groups?.includes(g.key || ''))
                        .map((d) => d.name)
                        .join(', ') || '-'}
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.TypeOfGoods" />
                </Typography>
                <Box>{order.type || '-'}</Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.Weight" />
                </Typography>
                <Box>{order.weight || '-'}</Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.PalletsCount" />
                </Typography>
                <Box>{order.palletsCount || '-'}</Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.TemperatureRegime" />
                </Typography>
                <Box>
                    {order.temperatureRegime || '-'}{' '}
                    <FormattedMessage id="app.Celsius" />
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.Client" />
                </Typography>
                <Box>
                    {allClients.find((c) => order.client === c.key)?.name ||
                        '-'}
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Typography sx={sx.label}>
                    <FormattedMessage id="app.Notes" />
                </Typography>
                <Box>{order.notes || '-'}</Box>
            </Grid>
        </Grid>
    )
}

const ComponentToPrint = forwardRef(
    (
        props: {
            route: Route
            distance: number[]
            toll: number[]
            ferry: boolean[]
            units: string
        },
        ref
    ) => {
        const allVehicles = useSelector((state: RootState) => state.vehicles)
        const allDrivers = useSelector((state: RootState) => state.drivers)
        const allGroups = useSelector((state: RootState) => state.groups)
        return (
            <Box component="div" ref={ref} sx={sx.print}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {props.route?.locations &&
                                props.route.locations
                                    .map((location) => location.address)
                                    .join(' → ')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.StartDateAndHour" />
                        </Typography>
                        <Box>
                            {props.route.startDate
                                ? format(
                                      props.route.startDate,
                                      'dd/MM/yyyy HH:mm'
                                  )
                                : '-'}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.EndDateAndHour" />
                        </Typography>
                        <Box>
                            {props.route.endDate
                                ? format(
                                      props.route.endDate,
                                      'dd/MM/yyyy HH:mm'
                                  )
                                : '-'}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.Vehicle" />
                        </Typography>
                        <Box>
                            {allVehicles.find(
                                (v) => v.key === props.route.vehicleId
                            )?.name || '-'}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.FuelConsumption" />
                        </Typography>
                        <Box>{props.route.fuelConsumption || '-'}</Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.Drivers" />
                        </Typography>
                        <Box>
                            {allDrivers
                                .filter((d) =>
                                    props.route.drivers?.includes(d.key)
                                )
                                .map((d) => d.name)
                                .join(', ') || '-'}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.Groups" />
                        </Typography>
                        <Box>
                            {allGroups
                                .filter((g) =>
                                    props.route.groups?.includes(g.key || '')
                                )
                                .map((d) => d.name)
                                .join(', ') || '-'}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.Stops" />
                        </Typography>
                        {(!props.route.locations ||
                            props.route.locations.length === 0) && (
                            <FormattedMessage id="app.NoStops" />
                        )}
                        {props.route.locations &&
                            props.route.locations.length > 0 &&
                            props.route.locations.map((location, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon
                                        sx={{ margin: 0, padding: 0 }}
                                    >
                                        {index === 0 ||
                                        index ===
                                            (props.route?.locations &&
                                                props.route?.locations.length -
                                                    1) ? (
                                            <Adjust />
                                        ) : (
                                            <ArrowDownward />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            `(${
                                                index !== undefined && index + 1
                                            }) ` +
                                                `[${location.code}] ` +
                                                location.address || ''
                                        }
                                        secondaryTypographyProps={{
                                            color: '#333',
                                        }}
                                        secondary={
                                            <>
                                                {Boolean(
                                                    props.distance[index]
                                                ) && (
                                                    <Typography variant="caption">
                                                        {(
                                                            (props.distance[
                                                                index
                                                            ] /
                                                                1000) *
                                                            (props.units === 'm'
                                                                ? 0.621371192
                                                                : 1)
                                                        ).toFixed(1)}
                                                        <FormattedMessage
                                                            id={
                                                                props.units ===
                                                                'm'
                                                                    ? 'app.Mi'
                                                                    : 'app.Km'
                                                            }
                                                        />
                                                    </Typography>
                                                )}{' '}
                                                {Boolean(props.toll[index]) && (
                                                    <Typography variant="caption">
                                                        <FormattedMessage id="app.Toll" />
                                                        :{' '}
                                                        {
                                                            +props.toll[
                                                                index
                                                            ].toFixed(2)
                                                        }{' '}
                                                        {
                                                            (
                                                                currencies as Currencies
                                                            )[
                                                                props.route
                                                                    ?.currency ||
                                                                    'EUR'
                                                            ].symbol
                                                        }
                                                    </Typography>
                                                )}
                                                {props.ferry[index] && (
                                                    <DirectionsBoat
                                                        fontSize="small"
                                                        sx={{
                                                            marginLeft: 1,
                                                            marginBottom: -0.7,
                                                        }}
                                                    />
                                                )}
                                            </>
                                        }
                                    />
                                    {(location.loading ||
                                        location.unloading ||
                                        location.parking ||
                                        location.refueling) && (
                                        <Box sx={sx.icons}>
                                            {location.loading && (
                                                <FileUpload fontSize="small" />
                                            )}
                                            {location.unloading && (
                                                <Download fontSize="small" />
                                            )}
                                            {location.parking && (
                                                <LocalParking fontSize="small" />
                                            )}
                                            {location.refueling && (
                                                <LocalGasStation fontSize="small" />
                                            )}
                                        </Box>
                                    )}
                                </ListItem>
                            ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={sx.label}>
                            <FormattedMessage id="app.Orders" />
                        </Typography>
                        {(!props.route.orders ||
                            props.route.orders.length === 0) && (
                            <FormattedMessage id="app.NoOrders" />
                        )}
                        {props.route.orders &&
                            props.route.orders.length > 0 &&
                            props.route.orders.map((order, i) => (
                                <OrderPrint order={order} key={i} />
                            ))}
                    </Grid>
                </Grid>
            </Box>
        )
    }
)

export default ComponentToPrint
