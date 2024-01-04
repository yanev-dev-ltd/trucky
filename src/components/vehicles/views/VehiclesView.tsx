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

import EditVehicle from '@/components/vehicles/components/EditVehicle/EditVehicle'
import AddVehicleWithButton from '@/components/vehicles/components/AddVehicleWithButton/AddVehicleWithButton'
import sx from '../styles/Vehicles.sx'
import { Vehicles, VehicleProps } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Group } from '@/components/common/Group/Group'

export const VehiclesView: FC<VehicleProps> = ({
    vehicles,
    vehicleId,
    edit,
    searchRef,
    fuse,
    columns,
    routeId,
    drivers,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicles>(vehicles)
    useEffect(() => {
        if (search && typeof search === 'string' && search.length >= 3) {
            const tempVehicles = fuse.search(search)
            setFilteredVehicles(tempVehicles.map((s) => s.item))
        } else {
            setFilteredVehicles(vehicles)
        }
    }, [search, vehicles])

    if (vehicles?.[0]?.key === 'loading' || drivers?.[0]?.key === 'loading') {
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
                    <Group type="vehicle" />
                </Box>
                <AddVehicleWithButton />
            </Box>
            {Array.isArray(vehicles) && filteredVehicles.length > 0 && (
                <Table
                    stickyHeader
                    columns={columns}
                    data={filteredVehicles}
                    name="vehicles"
                />
            )}
            {Array.isArray(filteredVehicles) &&
                filteredVehicles.length === 0 && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        style={{ height: 'calc(100vh - 54px - 72px)' }}
                    >
                        <Typography variant="h5" sx={sx.padding}>
                            <FormattedMessage id="app.noVehicles" />
                        </Typography>
                    </Box>
                )}
            <EditVehicle
                vehicle={vehicles.find((v) => v.key === vehicleId)}
                edit={edit}
                routeId={routeId}
            />
        </Box>
    )
}
