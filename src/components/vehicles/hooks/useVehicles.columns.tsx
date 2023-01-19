import { useMemo } from 'react'
import Link from 'next/link'
import { Column } from 'react-table'
import { Vehicle, Vehicles, VehicleTypes, FuelTypes } from '../types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Typography, Box, Tooltip, IconButton } from '@mui/material'
import { FormatListBulleted } from '@mui/icons-material'
import Overflow from '../../common/Overflow/Overflow'
import sx from '../styles/Vehicles.sx'
import drivers from '../../../api/drivers'

const useVehiclesColumns = (vehicles: Vehicles) => {
    const intl = useIntl()
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Vehicle>[]>(
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

    return { columns }
}

export default useVehiclesColumns
