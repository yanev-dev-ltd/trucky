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
    InputAdornment,
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
                'mileage',
                'route',
                {
                    name: 'driver',
                    getFn: (d) =>
                        drivers.find((dr) => dr.id === d.driver)?.name +
                        ' ' +
                        drivers.find((dr) => dr.id === d.driver)?.phone,
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

    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo(
        () => [
            {
                Header: <FormattedMessage id="app.Name" />,
                id: 'name',
                accessor: (v: Vehicle) =>
                    v.name ? <Overflow text={v.name} /> : '-',
                maxWidth: 240,
                sortType,
            },
            {
                Header: (
                    <Box component={'span'} sx={sx.multiLineHeader}>
                        <FormattedMessage id="app.Type" />
                        <Typography variant="caption">
                            <FormattedMessage id="app.Fuel" />
                        </Typography>
                    </Box>
                ),
                id: 'type',
                accessor: (v: Vehicle) => (
                    <Box>
                        <Overflow
                            text={
                                v.type
                                    ? intl.formatMessage({
                                          id: `app.VehicleType.${
                                              VehicleTypes[
                                                  v.type as keyof typeof VehicleTypes
                                              ]
                                          }`,
                                      })
                                    : '-'
                            }
                        />
                        <Overflow
                            text={
                                v.fuel
                                    ? intl.formatMessage({
                                          id: `app.FuelType.${
                                              FuelTypes[
                                                  v.fuel as keyof typeof FuelTypes
                                              ]
                                          }`,
                                      })
                                    : '-'
                            }
                            variant="caption"
                        />
                    </Box>
                ),
                sortType: (a: any, b: any, id: string) => {
                    if (!a?.original[id]) return 1
                    if (!b?.original[id]) return -1
                    if (
                        intl.formatMessage({
                            id: `app.VehicleType.${
                                VehicleTypes[
                                    a?.original[id] as keyof typeof VehicleTypes
                                ]
                            }`,
                        }) >
                        intl.formatMessage({
                            id: `app.VehicleType.${
                                VehicleTypes[
                                    b?.original[id] as keyof typeof VehicleTypes
                                ]
                            }`,
                        })
                    ) {
                        return 1
                    }
                    if (
                        intl.formatMessage({
                            id: `app.VehicleType.${
                                VehicleTypes[
                                    a?.original[id] as keyof typeof VehicleTypes
                                ]
                            }`,
                        }) <
                        intl.formatMessage({
                            id: `app.VehicleType.${
                                VehicleTypes[
                                    b?.original[id] as keyof typeof VehicleTypes
                                ]
                            }`,
                        })
                    ) {
                        return -1
                    }
                    return 0
                },
            },
            {
                Header: <FormattedMessage id="app.Mileage" />,
                id: 'mileage',
                accessor: (v: Vehicle) => {
                    return v.mileage ? (
                        <Box display="flex" alignItems="baseline" gap={1}>
                            <Overflow text={v?.mileage} />
                            <Typography variant="caption">
                                {v?.units === 'km' ? (
                                    <FormattedMessage id="app.Km" />
                                ) : v?.units === 'm' ? (
                                    <FormattedMessage id="app.Mi" />
                                ) : (
                                    <FormattedMessage id="app.Hrs" />
                                )}
                            </Typography>
                        </Box>
                    ) : (
                        '-'
                    )
                },
                maxWidth: 160,
                sortType: (a: any, b: any, id: string) => {
                    if (isNaN(+a.original[id])) return 1
                    if (isNaN(+b.original[id])) return -1
                    if (a.original[id] > b.original[id]) {
                        return 1
                    }
                    if (a.original[id] < b.original[id]) {
                        return -1
                    }
                    return 0
                },
            },
            {
                Header: <FormattedMessage id="app.Driver" />,
                id: 'driver',
                accessor: (v: Vehicle) => {
                    const driver = drivers.find((d) => d.id === v.driver)
                    return driver ? (
                        <>
                            <Overflow text={driver.name} />
                            {driver?.phone && (
                                <Overflow
                                    variant="caption"
                                    text={driver?.phone}
                                />
                            )}
                        </>
                    ) : (
                        '-'
                    )
                },
                maxWidth: 160,
                sortType: (a: any, b: any, id: string) => {
                    const d1name = drivers.find(
                        (d) => d.id === a?.original[id]
                    )?.name
                    const d2name = drivers.find(
                        (d) => d.id === b?.original[id]
                    )?.name
                    if (!d1name) return 1
                    if (!d2name) return -1
                    if (d1name > d2name) {
                        return 1
                    }
                    if (d1name < d2name) {
                        return -1
                    }
                    return 0
                },
            },
            {
                Header: <FormattedMessage id="app.LastRoute" />,
                id: 'route',
                accessor: (v: Vehicle) =>
                    v.route ? <Overflow text={v.route} /> : '-',
                maxWidth: 240,
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (v: Vehicle) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton
                            component={Link}
                            href={`/vehicles/${v.key}`}
                        >
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
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
                <TextField
                    variant="outlined"
                    label={<FormattedMessage id="app.Search" />}
                    size="small"
                    onChange={(e) => setSearch(e.target.value)}
                    sx={sx.search}
                    inputRef={ref}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="caption">
                                    ctrl + S
                                </Typography>
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
