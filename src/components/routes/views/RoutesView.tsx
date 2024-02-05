import { useState, useEffect, FC } from 'react'
import Table from '@/components/common/Table/Table'
import {
    TextField,
    CircularProgress,
    Box,
    Typography,
    InputAdornment,
    Paper,
} from '@mui/material'

import { Search } from '@mui/icons-material'

import Route from '@/components/routes/components/Route/Route'
import sx from '../styles/Routes.sx'
import { Routes, RoutesProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Group } from '@/components/common/Group/Group'
import AddRouteWithButton from '../components/AddRouteWithButton/AddRouteWithButton'

export const RoutesView: FC<RoutesProps> = ({
    routes,
    routeId,
    searchRef,
    fuse,
    columns,
    drivers,
    vehicles,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredRoutes, setFilteredRoutes] = useState<Routes>(routes)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempRoutes = fuse.search(search)
            setFilteredRoutes(tempRoutes.map((s) => s.item))
        } else {
            setFilteredRoutes(routes)
        }
    }, [search, routes])

    if (
        routes?.[0]?.key === 'loading' ||
        vehicles?.[0]?.key === 'loading' ||
        drivers?.[0]?.key === 'loading'
    ) {
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
                    <Group type="route" />
                </Box>
                <AddRouteWithButton />
            </Box>
            {Array.isArray(routes) && filteredRoutes.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredRoutes}
                    name="routes"
                />
            )}
            {Array.isArray(filteredRoutes) && filteredRoutes.length === 0 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    style={{ height: 'calc(100vh - 54px - 72px)' }}
                >
                    <Typography variant="h5" sx={sx.padding}>
                        <FormattedMessage id="app.NoRoutes" />
                    </Typography>
                </Box>
            )}
            {routeId && <Route routeId={routeId} />}
        </Box>
    )
}
