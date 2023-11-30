import { useMemo } from 'react'
import { Column } from 'react-table'
import { Maintenance } from '../types'
import { FormattedMessage } from 'react-intl'
import { Tooltip, IconButton } from '@mui/material'
import Overflow from '@/components/common/Overflow/Overflow'
import { FormatListBulleted } from '@mui/icons-material'
import Link from 'next/link'
import { Vehicle } from '@/components/vehicles/types'
import { format } from 'date-fns'

const useMaintenanceColumns = (
    maintenance: Maintenance[],
    vehicles: Vehicle[]
) => {
    const sortType = (a: any, b: any, id: string) => {
        if (!a.original[id]) return 1
        if (!b.original[id]) return -1
        return a.original[id].localeCompare(b.original[id])
    }

    const columns = useMemo<Column<Maintenance>[]>(
        () => [
            {
                Header: <FormattedMessage id="app.Vehicle" />,
                id: 'vehicle',
                accessor: (m: Maintenance) =>
                    m.vehicleId ? (
                        <Overflow
                            text={
                                vehicles.find((v) => v.key === m.vehicleId)
                                    ?.name || '-'
                            }
                        />
                    ) : (
                        '-'
                    ),
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Date" />,
                id: 'date',
                accessor: (m: Maintenance) =>
                    m.date ? format(new Date(+m.date), 'dd/MM/yyyy') : '-',
            },
            {
                Header: <FormattedMessage id="app.Type" />,
                id: 'type',
                accessor: (m: Maintenance) =>
                    m.type ? <Overflow text={m.type} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Description" />,
                id: 'description',
                accessor: (m: Maintenance) =>
                    m.description ? <Overflow text={m.description} /> : '-',
                sortType,
            },
            {
                Header: <FormattedMessage id="app.Details" />,
                id: 'details',
                accessor: (v: Maintenance) => (
                    <Tooltip title={<FormattedMessage id="app.Details" />}>
                        <IconButton
                            component={Link}
                            href={`/maintenance/${v.key}`}
                        >
                            <FormatListBulleted />
                        </IconButton>
                    </Tooltip>
                ),
                disableSortBy: true,
            },
        ],
        [maintenance, vehicles]
    )

    return { columns }
}

export default useMaintenanceColumns
