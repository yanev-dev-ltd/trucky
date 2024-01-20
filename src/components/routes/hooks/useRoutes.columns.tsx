import { useMemo } from 'react'
import Link from 'next/link'
import { Column } from 'react-table'
import { Route, Routes } from '../types'
import { FormattedMessage } from 'react-intl'
import { Box, Tooltip, IconButton } from '@mui/material'
import { FormatListBulleted } from '@mui/icons-material'
import Overflow from '@/components/common/Overflow/Overflow'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { GroupsView } from '@/components/common/Group/components/GroupsView/GroupsView'
import { format } from 'date-fns'

const useRoutesColumns = (routes: Routes) => {
    const allDrivers = useSelector((state: RootState) => state.drivers)
    const allVehicles = useSelector((state: RootState) => state.vehicles)
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Route>[]>(
        () => [
            {
                Header: '',
                id: 'groups',
                accessor: (r: Route) => <GroupsView groups={r.groups || []} />,
                width: 36,
            },
            {
                Header: <FormattedMessage id="app.Vehicle" />,
                id: 'vehicle',
                accessor: (r: Route) => {
                    const v = allVehicles.find((v) => v.key === r.vehicleId)
                    return v?.name ? <Overflow text={v.name} /> : '-'
                },
                maxWidth: 240,
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Route" />,
                id: 'route',
                accessor: (r: Route) => (
                    <Overflow
                        text={
                            (r?.locations &&
                                r.locations
                                    .map((location) => location.code)
                                    .join(' → ')) ||
                            ''
                        }
                    />
                ),
            },
            {
                Header: <FormattedMessage id="app.StartDateAndHour" />,
                id: 'startDate',
                accessor: (r: Route) =>
                    r.startDate
                        ? format(new Date(r.startDate), 'dd.MM.yyyy HH:mm')
                        : '-',
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
                Header: <FormattedMessage id="app.EndDateAndHour" />,
                id: 'endDate',
                accessor: (r: Route) =>
                    r.endDate
                        ? format(new Date(r.endDate), 'dd.MM.yyyy HH:mm')
                        : '-',
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
                accessor: (r: Route) => {
                    const drivers = allDrivers.filter((d) =>
                        r.drivers?.find((dr) => dr === d.key)
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
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (r: Route) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton component={Link} href={`/routes/${r.key}`}>
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
            },
        ],
        [routes, allDrivers, allVehicles]
    )

    return { columns }
}

export default useRoutesColumns
