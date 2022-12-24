import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Table from '../../common/Table/Table'
import { FormatListBulleted } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import Fuse from 'fuse.js'
import {
    TextField,
    CircularProgress,
    IconButton,
    Box,
    Typography,
    Tooltip,
} from '@mui/material'

import EditVehicle from '../components/EditVehicle/EditVehicle'
import AddVehicle from '../components/AddVehicle/AddVehicle'

import types from '../../../api/types'
import drivers from '../../../api/drivers'

import sx from '../styles/Vehicles.sx'
import { Vehicle, VehicleProps } from '../types'

export const VehiclesView: React.FC<VehicleProps> = ({
    vehicles,
    vehicleId,
    edit,
}): JSX.Element => {
    const [search, setSearch] = useState<string | boolean>(false)
    const [filteredVehicles, setFilteredVehicles] =
        useState<Vehicle[]>(vehicles)
    useEffect(() => {
        const fuse = new Fuse(vehicles, {
            keys: [
                'name',
                {
                    name: 'driver',
                    getFn: (d) =>
                        drivers.find((dr) => dr.id === d.driver)?.name || '',
                },
                {
                    name: 'type',
                    getFn: (t) =>
                        types.find((type) => type.id === t.type)?.name || '',
                },
            ],
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            minMatchCharLength: 3,
        })

        if (search && typeof search === 'string' && search.length >= 3) {
            const tempVehicles = fuse.search(search)
            setFilteredVehicles(tempVehicles.map((s) => s.item))
        } else {
            setFilteredVehicles(vehicles)
        }
    }, [search, vehicles])
    const columns = useMemo(
        () => [
            {
                Header: <FormattedMessage id="app.Name" />,
                id: 'name',
                accessor: (v: Vehicle) => v.name,
            },
            {
                Header: <FormattedMessage id="app.Type" />,
                id: 'type',
                accessor: (v: Vehicle) =>
                    types.find((t) => t.id === v.type)?.name,
            },
            {
                Header: <FormattedMessage id="app.Driver" />,
                id: 'driver',
                accessor: (v: Vehicle) =>
                    drivers.find((d) => d.id === v.driver)?.name,
            },
            {
                Header: <FormattedMessage id="app.Route" />,
                id: 'route',
                accessor: (v: Vehicle) => v.route || '-',
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (v) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton
                            component={Link}
                            href={`/vehicles/${v.key}`}
                        >
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        []
    )

    // TODO : end day of payment

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
                />
                <AddVehicle />
            </Box>
            {Array.isArray(vehicles) && filteredVehicles.length > 0 && (
                <Table
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
