import { useMemo, useState, useEffect, useRef } from 'react'
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

import drivers from '../../../api/drivers'

import sx from '../styles/Vehicles.sx'
import { Vehicle, VehicleProps, VehicleTypes, FuelTypes } from '../types'
import { useIntl } from 'react-intl'
import Overflow from '../../common/Overflow/Overflow'

export const VehiclesView: React.FC<VehicleProps> = ({
    vehicles,
    vehicleId,
    edit,
}): JSX.Element => {
    const intl = useIntl()
    const [search, setSearch] = useState<string | boolean>(false)
    const ref = useRef<HTMLInputElement | null>(null)
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
                        t.type
                            ? intl.formatMessage({
                                  id: `app.VehicleType.${
                                      VehicleTypes[
                                          t.type as keyof typeof VehicleTypes
                                      ]
                                  }`,
                              })
                            : '-',
                },
                {
                    name: 'fuel',
                    getFn: (t) =>
                        t.fuel
                            ? intl.formatMessage({
                                  id: `app.FuelType.${
                                      FuelTypes[
                                          t.fuel as keyof typeof FuelTypes
                                      ]
                                  }`,
                              })
                            : '-',
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
                accessor: (v: Vehicle) => <Overflow text={v.name || '-'} />,
                maxWidth: 300,
            },
            {
                Header: <FormattedMessage id="app.Type" />,
                id: 'type',
                accessor: (v: Vehicle) =>
                    v.type ? (
                        <Overflow
                            text={intl.formatMessage({
                                id: `app.VehicleType.${
                                    VehicleTypes[
                                        v.type as keyof typeof VehicleTypes
                                    ]
                                }`,
                            })}
                        />
                    ) : (
                        <Overflow text={'-'} />
                    ),
            },
            {
                Header: <FormattedMessage id="app.Fuel" />,
                id: 'fuel',
                accessor: (v: Vehicle) =>
                    v.fuel ? (
                        <Overflow
                            text={intl.formatMessage({
                                id: `app.FuelType.${
                                    FuelTypes[v.fuel as keyof typeof FuelTypes]
                                }`,
                            })}
                        />
                    ) : (
                        <Overflow text={'-'} />
                    ),
            },
            {
                Header: <FormattedMessage id="app.Driver" />,
                id: 'driver',
                accessor: (v: Vehicle) => (
                    <Overflow
                        text={
                            drivers.find((d) => d.id === v.driver)?.name || '-'
                        }
                    />
                ),
                maxWidth: 160,
            },
            {
                Header: <FormattedMessage id="app.Route" />,
                id: 'route',
                accessor: (v: Vehicle) => <Overflow text={v.route || '-'} />,
                maxWidth: 300,
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
        [vehicles]
    )

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === 's' && event.ctrlKey) {
                event.preventDefault()
                ref.current?.focus()
            }
        }
        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [])

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
                <Tooltip title="ctrl + S">
                    <TextField
                        variant="outlined"
                        label={<FormattedMessage id="app.Search" />}
                        size="small"
                        onChange={(e) => setSearch(e.target.value)}
                        sx={sx.search}
                        inputRef={ref}
                    />
                </Tooltip>
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
