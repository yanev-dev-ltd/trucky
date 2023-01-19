import { useState, useEffect } from 'react'
import Table from '../../common/Table/Table'
import {
    TextField,
    CircularProgress,
    Box,
    Typography,
    InputAdornment,
    Paper,
} from '@mui/material'

import EditVehicle from '../components/EditVehicle/EditVehicle'
import AddVehicle from '../components/AddVehicle/AddVehicle'

import sx from '../styles/Vehicles.sx'
import { Vehicles, VehicleProps } from '../types'
import { FormattedMessage } from 'react-intl'

export const VehiclesView: React.FC<VehicleProps> = ({
    vehicles,
    vehicleId,
    edit,
    searchRef,
    fuse,
    columns,
}): JSX.Element => {
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

    if (vehicles?.[0]?.key === 'loading') {
        return (
            <Box sx={sx.loading}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={sx.header}>
                <TextField
                    variant="outlined"
                    label={<FormattedMessage id="app.Search" />}
                    size="small"
                    onChange={(e) => setSearch(e.target.value)}
                    sx={sx.search}
                    inputRef={searchRef}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Paper sx={sx.searchKey}>
                                    <Typography variant="caption">/</Typography>
                                </Paper>
                            </InputAdornment>
                        ),
                    }}
                />
                <AddVehicle />
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
                vehicle={filteredVehicles.find((v) => v.key === vehicleId)}
                edit={edit}
            />
        </Box>
    )
}

export default VehiclesView
