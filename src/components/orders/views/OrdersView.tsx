import { useState, useEffect, FC, useMemo } from 'react'
import Table from '@/components/common/Table/Table'
import {
    TextField,
    CircularProgress,
    Box,
    Typography,
    InputAdornment,
    Paper,
    Button,
} from '@mui/material'

import { Add, Search } from '@mui/icons-material'

import Route from '@/components/routes/components/Route/Route'
import sx from '../styles/Orders.sx'
import { Order, OrdersProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Group } from '@/components/common/Group/Group'
import { OrderDialog } from '../components/OrderDialog/OrderDialog'
import { useRouter } from 'next/router'
// import AddRouteWithButton from '../components/AddRouteWithButton/AddRouteWithButton'

export const OrdersView: FC<OrdersProps> = ({
    orders,
    orderId,
    searchRef,
    fuse,
    columns,
    vehicles,
    locations,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const router = useRouter()
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempOrders = fuse.search(search)
            setFilteredOrders(tempOrders.map((s) => s.item))
        } else {
            setFilteredOrders(orders)
        }
    }, [search, orders])

    const order = useMemo(() => {
        return orders.find((o) => o.key === orderId)
    }, [orderId, orders])

    if (orders?.[0]?.key === 'loading' || vehicles?.[0]?.key === 'loading') {
        return (
            <Box sx={sx.loading}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={sx.header}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                >
                    <TextField
                        variant="outlined"
                        placeholder={intl.formatMessage({ id: 'app.Search' })}
                        size="small"
                        onChange={(e) => setSearch(e.target.value)}
                        sx={sx.search}
                        inputRef={searchRef}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Paper sx={sx.searchKey} elevation={2}>
                                        <Typography variant="caption">
                                            /
                                        </Typography>
                                    </Paper>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Group type="order" />
                </Box>
                <Button onClick={() => router.push('/routes')}>
                    <FormattedMessage id="app.AddOrderFromRoutes" />
                </Button>
            </Box>
            {Array.isArray(orders) && filteredOrders.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredOrders}
                    name="orders"
                />
            )}
            {Array.isArray(filteredOrders) && filteredOrders.length === 0 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    style={{ height: 'calc(100vh - 54px - 72px)' }}
                >
                    <Typography variant="h5" sx={sx.padding}>
                        <FormattedMessage id="app.NoOrders" />
                    </Typography>
                </Box>
            )}
            {order && locations && locations.length > 0 && (
                <OrderDialog
                    setOpen={() => router.push('/orders')}
                    open={!!orderId}
                    order={order}
                    locations={locations}
                />
            )}
        </Box>
    )
}
