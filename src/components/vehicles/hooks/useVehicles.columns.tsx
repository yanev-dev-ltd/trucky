import { useMemo } from 'react'
import Link from 'next/link'
import { Column } from 'react-table'
import { Vehicle, Vehicles, VehicleTypes } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Typography, Box, Tooltip, IconButton } from '@mui/material'
import { FormatListBulleted } from '@mui/icons-material'
import Overflow from '@/components/common/Overflow/Overflow'
import sx from '../styles/Vehicles.sx'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { GroupsView } from '@/components/common/Group/components/GroupsView/GroupsView'

const useVehiclesColumns = (vehicles: Vehicles) => {
    const intl = useIntl()
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const allTrailers = useSelector((state: RootState) => state.trailers)
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Vehicle>[]>(
        () => [
            {
                Header: '',
                id: 'groups',
                accessor: (v: Vehicle) =>
                    v.groups ? <GroupsView groups={v.groups} /> : null,
                width: 36,
            },
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
                                          id: `app.VehicleType.${v.type}`,
                                      })
                                    : '-'
                            }
                        />
                        <Overflow
                            text={
                                v.fuel
                                    ? intl.formatMessage({
                                          id: `app.FuelType.${v.fuel}`,
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
                Header: <FormattedMessage id="app.Trailer" />,
                id: 'trailer',
                accessor: (v: Vehicle) => {
                    const t = allTrailers.find((t) => t.key === v.trailer)
                    return v.trailer ? (
                        <Box>
                            <Overflow text={t?.name || '-'} />
                            <Overflow
                                text={
                                    t?.type
                                        ? intl.formatMessage({
                                              id: `app.TrailerType.${t.type}`,
                                          })
                                        : '-'
                                }
                                variant="caption"
                            />
                        </Box>
                    ) : (
                        '-'
                    )
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
                Header: <FormattedMessage id="app.Drivers" />,
                id: 'drivers',
                accessor: (v: Vehicle) => {
                    const drivers = allDrivers.filter((d) =>
                        v.drivers?.find((dr) => dr === d.key)
                    )
                    return !drivers || drivers.length === 0 ? (
                        '-'
                    ) : drivers.length === 1 ? (
                        <Box>
                            <Overflow text={drivers[0]?.name || '-'} />
                            {drivers[0]?.phone && (
                                <Overflow
                                    variant="caption"
                                    text={drivers[0]?.phone}
                                />
                            )}
                        </Box>
                    ) : (
                        <Overflow
                            text={drivers.map((d) => d.name).join(', ')}
                        />
                    )
                },
                maxWidth: 160,
                disableSortBy: true,
            },
            // {
            //     Header: <FormattedMessage id="app.LastRoute" />,
            //     id: 'route',
            //     accessor: (v: Vehicle) =>
            //         v.route ? <Overflow text={v.route} /> : '-',
            //     maxWidth: 240,
            //     sortType,
            // },
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
        [vehicles, allDrivers, allTrailers]
    )

    return { columns }
}

export default useVehiclesColumns
